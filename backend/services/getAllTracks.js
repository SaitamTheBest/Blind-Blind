import axios from "axios";
import getGenresByArtistId from "./getGenresByArtistId.js";

const MAX_RETRIES = 5;

export async function fetchWithRetry(url, options, retries = 0) {
    try {
        return await axios.get(url, options);
    } catch (error) {
        if (error.response && error.response.status === 429 && retries < MAX_RETRIES) {
            const retryAfter = parseInt(error.response.headers['retry-after']) || 1;
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            return fetchWithRetry(url, options, retries + 1);
        }
        throw error;
    }
}

export default async function getAllTracks(token) {
    const ID_PLAYLIST = process.env.ID_PLAYLIST;
    const baseUrl = `https://api.spotify.com/v1/playlists/${ID_PLAYLIST}`;
    try {
        const response = await fetchWithRetry(baseUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                fields: 'tracks.items(track(name,artists(name,id),album(name,release_date,images),external_urls.spotify,preview_url,popularity))'
            }
        });

        return await Promise.all(response.data.tracks.items.map(async item => {
            const track = item.track;

            const artistGenres = [];
            for (const artist of track.artists) {
                const artistId = artist.id;
                const genres = await getGenresByArtistId(token, artistId);
                if (genres.length > 0){
                    genres.forEach(genre => artistGenres.push(genre));
                }
            }
            if (artistGenres.length === 0) {
                artistGenres.push('Non renseigné');
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
        if (error.response) {
            console.error('Erreur dans getAllTracks :', error.response.data);
        } else {
            console.error('Erreur dans getAllTracks :', error.message);
        }
        throw new Error('Impossible de récupérer les tracks.');
    }
}