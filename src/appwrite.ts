import { Client, Databases, Query, ID } from "appwrite";
import { Movie } from "./types/interfaces";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm: string, movie: Movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm),
        ]);

        if (result.documents.length > 0) {
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            });
        } else {
            const movieId = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
                Query.equal('movie_id', movie.id),
            ]);

            if (movieId.documents.length > 0) {
                const doc2 = movieId.documents[0];

                await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc2.$id, {
                    count: doc2.count + 1,
                });
            } else {
                await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                    searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
        ]);

        /* return result.documents; */
        return result.documents.map(doc => ({
            $id: doc.$id,
            count: doc.count,
            movied_id: doc.movied_id,
            poster_url: doc.poster_url,
            searchTerm: doc.searchTerm
        }));
    } catch (error) {
        console.log(error);
    }
}