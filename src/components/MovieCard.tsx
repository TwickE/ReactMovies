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
            console.log(data);

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
                            <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="shad-dialog">
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className='text-red-500'>{errorMessage}</p>
                    ) : (
                        <DialogHeader>
                            <DialogTitle>{movieData?.title ? movieData?.title : "N/A"}</DialogTitle>
                            <DialogDescription>
                                <img
                                    src={movieData?.poster_path ? `https://image.tmdb.org/t/p/w500/${movieData?.poster_path}` : '/no-movie.png'}
                                    alt={movieData?.title}
                                />
                            </DialogDescription>
                        </DialogHeader>
                    )}
                </DialogContent>
            </Dialog>
        </li>
    );
}

export default MovieCard;