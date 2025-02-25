import { useState, useEffect } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';
import { DatabaseMovie, Movie } from './types/interfaces';
import ThemeSwitch from './components/ThemeSwitch';
import LanguageSwitch from './components/LanguageSwitch';
import { useTranslation } from 'react-i18next';

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

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const { t } = useTranslation("global");

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchMovies = async (query = "", pageNumber = 1) => {
        setIsLoadingList(true);
        setErrorMessageList("");

        try {
            const currentLanguage = localStorage.getItem('language') || 'en';
            const endpoint = query ?
                `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=${currentLanguage === 'en' ? 'en-Us' : 'pt-PT'}&page=${pageNumber}`
                :
                `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=${currentLanguage === 'en' ? 'en-Us' : 'pt-PT'}&page=${pageNumber}&sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error(t("app.errors.fetchMovies"));
            }

            const data = await response.json();

            if (data.response === 'False') {
                setErrorMessageList(data.Error || t("app.errors.fetchMovies"));
                setMovieList([]);
                return;
            }

            setMovieList(prev => pageNumber === 1 ? data.results : [...prev, ...data.results]);
            setHasMore(data.page < data.total_pages);

            if (query && data.results.length > 0 && pageNumber === 1) {
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMessageList(t("app.errors.fetchMovies"));
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
            setErrorMessageTrending(t("app.errors.fetchTrendingMovies"));
        } finally {
            setIsLoadingTrending(false);
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
                !isLoadingList &&
                hasMore
            ) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoadingList, hasMore]);

    useEffect(() => {
        setPage(1); // Reset page when search term changes
        fetchMovies(debouncedSearchTerm, 1);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        if (page > 1) {
            fetchMovies(debouncedSearchTerm, page);
        }
    }, [page]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);


    return (
        <main>
            <div className='pattern'></div>
            <div className='wrapper'>
                <div className='flex justify-end gap-4 w-full'>
                    <LanguageSwitch />
                    <ThemeSwitch />
                </div>
                <header>
                    <img src='./hero.png' />
                    <h1>
                        {t("app.titlePt1")}
                        <span className='text-gradient-light dark:text-gradient'>{t("app.titlePt2")}</span>
                        {t("app.titlePt3")}
                    </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>
                {trendingMovies.length > 0 && (
                    <section className='trending'>
                        <h2>{t("app.trendingMovies")}</h2>
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
                    <h2>{t("app.allMovies")}</h2>
                    {errorMessageList ? (
                        <p className='text-red-500'>{errorMessageList}</p>
                    ) : (
                        <>
                            <ul>
                                {movieList.map((movie: Movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </ul>
                            {isLoadingList && <Spinner />}
                        </>
                    )}
                </section>
            </div>
        </main>

    )
}

export default App