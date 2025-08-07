import {useEffect, useState} from 'react';
import './App.css'
import TrendingMovies from "./Components/TrendingMovies.jsx";
import SearchMovies from "./Components/Search.jsx";
import {UpdateSearchCount} from "./Appwrite.js";
import {useDebounce} from "react-use";
import Movies from "./Components/Movies.jsx";

// The moview DB API
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    }
}

function App() {
    // Search Movie
    const [searchMovie, setSearchMovie] = useState("");
    const [movie, setMovie] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    //fetch movies
    const fetchMovies = async (query = '') => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const endpoint = query ?
                `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&sort_by=popularity.desc` :
                `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);

            if(!response.ok) {
                throw new Error('Something went wrong');
            }

            //convert response to JSON
            const result = await response.json();

            //if response is false
            if(result.Response === "False") {
                setErrorMessage(result.Error || 'Something went wrong');
                setMovie([]);
                return;
            }

            //update movie state
            setMovie(result.results);

            //if movie exists, update search count
            if(query && result.results.length > 0) {
                await UpdateSearchCount(query, result.results[0]);
            }
        } catch (error) {
            setErrorMessage(error.message);
            setMovie([]);
            console.log('Error fetching movies', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useDebounce(() => {
        setDebouncedSearchTerm(searchMovie);
    }, 500, [searchMovie]);

  return (
      <main>
          <div className="pattern"></div>
          <div className="wrapper">
              <header>
                  <img src="./hero.png" alt="Hero Banner"/>
                  <h1>Find <span className="text-gradient">Movies</span> that You <span className="text-gradient">Love</span></h1>
                  <SearchMovies searchTerm={searchMovie} setSearchTerm={setSearchMovie}></SearchMovies>
              </header>

              <TrendingMovies></TrendingMovies>

              <section className="all-movies mt-20">
                  <h2 className="text-center">All Movies</h2>

                  {
                      loading ? (
                          <p>Loading...</p>
                      ) : errorMessage ? (
                          <p className="text-red-500">{errorMessage}</p>
                      ) : (
                          <ul>
                              {
                                  movie.map((movie) => (
                                      <Movies key={movie.id} movie={movie}></Movies>
                                  ))
                              }
                          </ul>
                      )
                  }
              </section>
          </div>
      </main>
  )
}

export default App
