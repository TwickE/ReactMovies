export interface SearchProps {
    searchTerm: string
    setSearchTerm: (searchTerm: string) => void
}

export interface Movie {
    id: number;
    title: string;
    vote_average: number;
    poster_path: string;
    release_date: string;
    original_language: string;
}

export interface MovieCardProps {
    movie: Movie;
}