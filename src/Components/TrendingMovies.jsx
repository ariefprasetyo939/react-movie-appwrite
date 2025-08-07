import {useEffect, useState} from "react";
import {GetTrendingMovies} from "../Appwrite.js";

// The moview DB API
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer " + TMDB_API_KEY
    }
}

export default function TrendingMovies() {
    const [trendingMovies, setTrendingMovies] = useState([]);

    //because we want load data from Appwrite, we need to call the function from Appwrite.js here
    const loadTrendingMovies = async () => {
        //load from Appwrite
        const result = await GetTrendingMovies();
        console.log('result', result);
        //update trending movies state
        setTrendingMovies(result);
    }

    //call loadTrendingMovies when the component is mounted. Dont forget to add the dependency to avoid infinite loop
    useEffect(() => {
        loadTrendingMovies();
    }, []);

    return (
        <div className='trending'>
            {
                trendingMovies.length > 0 && (
                    <section className='trending mt-20'>
                        <h2 className='text-white text-center text-2xl font-bold underline'>Trending Movies</h2>
                        <ul>
                            {
                                trendingMovies.map((movie, index) => (
                                    <li key={movie.$id}>
                                        <p>{index + 1}</p>
                                        <img src={movie.poster_url} alt={movie.title}/>
                                    </li>
                                ))
                            }
                        </ul>
                    </section>
                )
            }
        </div>
    )
}
