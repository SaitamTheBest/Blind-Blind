import axios from "axios";

export default async function getGenresByArtistId(token, id) {
    const baseUrl = `https://api.spotify.com/v1/artists/${id}`;

    const response = await axios.get(baseUrl, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data.genres;
}