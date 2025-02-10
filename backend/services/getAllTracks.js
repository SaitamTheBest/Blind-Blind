import axios from "axios";
import getGenresByArtistId from "./getGenresByArtistId.js";

export default async function getAllTracks(token) {
    const baseUrl = 'https://api.spotify.com/v1/playlists/25Gf2Vy0p0jMxZvbsTGXEz';
    try {
        const response = await axios.get(baseUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return await Promise.all(response.data.tracks.items.map(async item => {
            const track = item.track;
            if (!Array.isArray(track.artists)) {
                throw new Error('track.artists is not an array');
            }

            const artistGenres = [];
            for (const artist of track.artists) {
                const artistId = artist.id;
                const genres = await getGenresByArtistId(token, artistId);
                if (genres.length > 0) {
                    genres.forEach(genre => artistGenres.push(genre));
                }
            }
            if (artistGenres.length === 0) {
                artistGenres.push('Inconnu');
            }

            return {
                name: track.name,
                artists: track.artists.map(artist => artist.name),
                album: track.album.name,
                link: track.external_urls.spotify,
                preview_url: track.preview_url,
                image: track.album.images[0]?.url,
                release_date: track.album.release_date.split('-')[0],
                popularity: track.popularity,
                genres: artistGenres
            };
        }));
    } catch (error) {
        console.error('Erreur dans getAllTracks :', error.message);
        throw new Error('Impossible de récupérer les tracks.');
    }
}