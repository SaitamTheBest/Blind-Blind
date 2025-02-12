import axios from "axios";
import fetchWithRetry from "./getAllTracks.js";

// Fonction pour récupérer les genres d'un artiste depuis l'API Spotify
export default async function getGenresByArtistId(token, id) {
    const baseUrl = `https://api.spotify.com/v1/artists/${id}`;

    try {
        const response = await fetchWithRetry(baseUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.genres;
    } catch (error) {
        console.error(`Error fetching genres for artist ${id}:`, error.message);
        return [];
    }
}