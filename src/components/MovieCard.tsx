import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { MovieCardProps, MovieDetails } from '../types/interfaces';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Spinner from './Spinner';
import { formatYear, formatRuntime, formatRevenue, formatFullDate } from '../utils/formatters';

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const MovieCard = ({ movie }: MovieCardProps) => {
    const { id, title, vote_average, poster_path, release_date, original_language } = movie;
    const [movieData, setMovieData] = useState<MovieDetails | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { t } = useTranslation("global");

    const fetchMovieDetails = async (movieId: number) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const currentLanguage = localStorage.getItem('language') || 'en';
            const endpoint = `${API_BASE_URL}/movie/${movieId}?language=${currentLanguage === 'en' ? 'en-Us' : 'pt-PT'}`;

            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error(t("movieCard.errors.fetchMovie"));
            }

            const data = await response.json();

            if (data.response === 'False') {
                setErrorMessage(data.Error || t("movieCard.errors.fetchMovie"));
                return;
            }

            setMovieData(data);

        } catch (error) {
            console.error(`Error fetching movie details: ${error}`);
            setErrorMessage(t("movieCard.errors.fetchMovie"));
        } finally {
            setIsLoading(false);
        }
    }

    const handleDialogOpen = (open: boolean) => {
        if (open) {
            fetchMovieDetails(id);
        }
    };

    return (
        <li>
            <Dialog onOpenChange={handleDialogOpen}>
                <DialogTrigger className='cursor-pointer movie-card'>
                    <img
                        src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
                        alt={title}
                    />
                    <div className="mt-4">
                        <h3>{title}</h3>
                        <div className="content">
                            <div className="rating">
                                <img src="star.svg" alt="Star Icon" />
                                <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                            </div>
                            <span>·</span>
                            <p className="lang">{original_language}</p>
                            <span>·</span>
                            <p className="year">{release_date ? formatYear(release_date) : 'N/A'}</p>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="shad-dialog">
                    <DialogHeader>
                        <DialogTitle className="text-xl md:text-3xl font-bold text-center 2xl:text-start">
                            {isLoading ? (
                                "N/A"
                            ) : errorMessage ? (
                                <p className='text-red-500'>{errorMessage}</p>
                            ) : (
                                movieData?.title ? movieData?.title : "N/A"
                            )}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            {t("movieCard.dialogDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className='text-red-500'>{errorMessage}</p>
                    ) : (
                        <>
                            <div className="flex flex-row justify-center 2xl:justify-between items-center gap-4">
                                <p className="text-white dark:text-gray-100">
                                    {formatYear(movieData?.release_date || "N/A")}
                                    {" • "}
                                    {formatRuntime(movieData?.runtime || 0)}
                                </p>
                                <span className="flex flex-row justify-between items-center bg-light-mode-200 dark:bg-accent py-2 px-4 rounded-sm">
                                    <img src="star.svg" alt="Star Icon" />
                                    <p className="font-bold">{movieData?.vote_average ? movieData?.vote_average.toFixed(1) : 'N/A'}</p>
                                    <p className="text-accent dark:text-gray-100">{"/10"}</p>
                                </span>
                            </div>
                            <div className="flex items-start gap-8 flex-col 2xl:flex-row">
                                <img
                                    src={movieData?.poster_path ? `https://image.tmdb.org/t/p/w500/${movieData?.poster_path}` : '/no-movie.png'}
                                    alt={movieData?.title || "N/A"}
                                    className="h-auto w-full max-w-[175px] md:max-w-[300px] 2xl:max-w-[400px] rounded-lg m-auto 2xl:m-0"
                                />
                                <div className="space-y-4 m-auto max-h-[35dvh] overflow-y-auto 2xl:m-0">
                                    <div className="flex flex-col 2xl:flex-row items-center gap-4 2xl:items-start">
                                        <p className="text-white dark:text-light-mode-100 2xl:w-26">{t("movieCard.genres")}</p>
                                        <div className="flex flex-row gap-2 flex-1 flex-wrap justify-center 2xl:justify-start">
                                            {movieData?.genres ? movieData?.genres.map((genre, index) => (
                                                <span key={index} className="bg-light-mode-200 dark:bg-accent px-3 py-1 rounded-sm font-semibold">
                                                    {genre.name}
                                                </span>
                                            )) : "N/A"}
                                        </div>
                                    </div>

                                    <div className="flex flex-col 2xl:flex-row items-center gap-4 2xl:items-start">
                                        <p className="text-white dark:text-light-mode-100 2xl:w-26">{t("movieCard.overview")}</p>
                                        <p className="flex-1 text-center 2xl:text-start max-w-[500px] 2xl:max-w-auto">{movieData?.overview ? movieData?.overview : "N/A"}</p>
                                    </div>

                                    <div className="flex flex-col 2xl:flex-row items-center gap-4 2xl:items-start">
                                        <p className="text-white dark:text-light-mode-100 2xl:w-26">{t("movieCard.releaseDate")}</p>
                                        <p className="text-accent dark:text-light-mode-200 font-semibold">{movieData?.release_date ? formatFullDate(movieData?.release_date) : "N/A"}</p>
                                    </div>

                                    <div className="flex flex-col 2xl:flex-row items-center gap-4 2xl:items-start">
                                        <p className="text-white dark:text-light-mode-100 2xl:w-26">{t("movieCard.budget")}</p>
                                        <p className="text-accent dark:text-light-mode-200 font-semibold">{movieData?.budget ? formatRevenue(movieData?.budget) : "N/A"}</p>
                                    </div>

                                    <div className="flex flex-col 2xl:flex-row items-center gap-4 2xl:items-start">
                                        <p className="text-white dark:text-light-mode-100 2xl:w-26">{t("movieCard.revenue")}</p>
                                        <p className="text-accent dark:text-light-mode-200 font-semibold">{movieData?.revenue ? formatRevenue(movieData?.revenue) : "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </li>
    );
}

export default MovieCard;