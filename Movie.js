/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import './Movie.css';
import { AiOutlineSearch } from "react-icons/ai";
import axios from 'axios';

function Movie() {

    const [movies, setMovies] = useState([]);//to store fetch movies
    const [sortBy, setSortBy] = useState('popularity.desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [expandedMovieId, setExpandedMovieId] = useState('');
    const [genres, setGenres] = useState('');
    useEffect(() =>{
        const fetchGenres = async() =>{
            const response = await axios.get(
                'https://api.themoviedb.org/3/search/movie/list',
                {
                    params:{
                        api_key: '71be6689a7f51fbf3a66e7d9e7e57d1b',
                    },
                }
            );

            setGenres(response.data.genres);
        };
        fetchGenres();
    }, []);

    useEffect(()=>{
        const fetchMovies = async() =>{
            const response = await axios.get(
            'https://api.themoviedb.org/3/search/movie/list',
                {
                params: {
                    api_key:'71be6689a7f51fbf3a66e7d9e7e57d1b',
                    sort_by: sortBy,
                    page: 1,
                    with_genres: selectedGenre,
                    query: searchQuery,
                },
            }
            );
            setMovies(response.data.results);
        };
        fetchMovies();
    }, [searchQuery, sortBy, selectedGenre]);

    const handleSearchChange = (event) =>{
        setSearchQuery(event.target.value);
    }

    const handleSearchSubmit = async (event) =>{
        const response = await axios.get(
                'https://api.themoviedb.org/3/search/movie',
                {
                    params:{
                    api_key: '71be6689a7f51fbf3a66e7d9e7e57d1b',
                    query: searchQuery,
                
                    },
                }
            );
            setMovies(response.data.results);
        };
        const toggleDescription = (movieId) =>{

            setExpandedMovieId(expandedMovieId === movieId ? null : movieId)
        }

            const handleSortChange = (event) =>{
                setSortBy(event.target.value);
            }
            
            const handleGenreChange = (event) =>{
                setSelectedGenre(event.target.value);
            }
    return(
    <div>
        <h1>MovieHouse</h1>
        <div className='search-bar'>
            <input type='text' className='search-input' placeholder='Search Movie...' value={searchQuery} onChange={handleSearchChange}></input>
            <button onClick={handleSearchSubmit} className='search-button'>
            <AiOutlineSearch />
            </button>
        </div>
        <div className='filters'>
            <label htmlFor='sort-by'>Sort By:</label>
            <select id='sort-by' value={sortBy} onChange= {handleSortChange}>
                <option value="popularity.desc">Popularity Descending</option>
                <option value="popularity.asc">Popularity Ascending</option>
                <option value="vote_average.desc">Rating Descending</option>
                <option value="vote_average.asc">Rating Ascending</option>
                <option value="release_data.desc">Release Date Descending</option>
                <option value="release_data.asc">Release Date Ascending</option>
            </select>
            <lable htmlFor='genre'>Genre: </lable>
            <select id='genre' value={selectedGenre} onChange= {handleGenreChange}>
                <option value="">All Generes</option>
                { genres.map((genre) => {
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                })}
            </select>
        </div>
        <div className='movie-wrapper'>
            {movies.map((movie) => {
                <div key={movie.id} className='movie'>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
                    <h2>{movie.title}</h2>
                    <p className='rating'>Rating: {movie.vote_average}</p>
                     {expandedMovieId === movie.id ? (
                        <p>{movie.overview}</p>
                    ) : (
                        <p>{movie.overview.substring(0, 150)}....</p>
                    )}
                    <button onClick={() =>
                        toggleDescription(movie.id)}
                        className='read-more'>
                            {expandedMovieId === movie.id ? 'Show Less' : 'Read More'}
                            
                            </button>
                </div>
            })}
        </div>
    </div>
)
}

export default Movie