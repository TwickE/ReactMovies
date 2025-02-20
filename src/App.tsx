import { useState, useEffect } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';
import { DatabaseMovie, Movie } from './types/interfaces';
import ThemeSwitch from './components/ThemeSwitch';

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    const [movieList, setMovieList] = useState([]);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [errorMessageList, setErrorMessageList] = useState("");

    const [trendingMovies, setTrendingMovies] = useState([]);
    const [isLoadingTrending, setIsLoadingTrending] = useState(false);
    const [errorMessageTrending, setErrorMessageTrending] = useState("");

    /* TODO:
        Light and Dark Mode Toggle
        Language Toggle that changes the language of the data fetched
        Pagination or Infinite Scroll
        Movie Detail Modal
    */



    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchMovies = async (query = "") => {
        setIsLoadingList(true);
        setErrorMessageList("");

        try {
            const endpoint = query ?
                `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                :
                `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();

            if (data.response === 'False') {
                setErrorMessageList(data.Error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);

            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMessageList("Error fetching movies. Please try again later.");
        } finally {
            setIsLoadingList(false);
        }
    }

    const loadTrendingMovies = async () => {
        setIsLoadingTrending(true);
        try {
            const movies = await getTrendingMovies();

            setTrendingMovies(movies || []);
        } catch (error) {
            console.error(`Error loading trending movies: ${error}`);
            setErrorMessageTrending("Error loading trending movies. Please try again later.");
        } finally {
            setIsLoadingTrending(false);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);


    return (
        <main>
            <div className='pattern'></div>
            <div className='wrapper'>
                <div className='flex justify-end w-full'>
                    <ThemeSwitch />
                </div>
                <header>
                    <img src='./hero.png' />
                    <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>
                {trendingMovies.length > 0 && (
                    <section className='trending'>
                        <h2>Trending Movies</h2>
                        {isLoadingTrending ? (
                            <Spinner />
                        ) : errorMessageTrending ? (
                            <p className='text-red-500'>{errorMessageTrending}</p>
                        ) : (
                            <ul>
                                {trendingMovies.map((movie: DatabaseMovie, index: number) => (
                                    <li key={movie.$id}>
                                        <p>{index + 1}</p>
                                        <img src={movie.poster_url} alt={movie.searchTerm} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}
                <section className='all-movies'>
                    <h2>All Movies</h2>
                    {isLoadingList ? (
                        <Spinner />
                    ) : errorMessageList ? (
                        <p className='text-red-500'>{errorMessageList}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie: Movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>

    )
}

export default App