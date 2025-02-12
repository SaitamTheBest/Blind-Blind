import axios from "axios";
import getArtistNationality from "./musicbrainz.js";


export default async function getRandomTrack(token) {
    const baseUrl = 'https://api.spotify.com/v1/search';
    let attempts = 0; // Compteur de tentatives

    while (attempts < 5) { // On limite à 5 tentatives
        try {
            const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
            const params = { q: randomChar, type: 'track', limit: 1, offset: Math.floor(Math.random() * 1000), market: 'FR' };

            const response = await axios.get(baseUrl, {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });

            const track = response.data.tracks.items[0];
            if (!track) {
                console.warn('Aucune track trouvée, nouvelle tentative...');
                attempts++;
                continue; // Essaye une nouvelle recherche
            }

            const artistName = track.artists[0].name;
            const nationality = await getArtistNationality(artistName);

            return {
                name: track.name,
                artists: track.artists.map((artist) => artist.name).join('; '),
                album: track.album.name,
                link: track.external_urls.spotify,
                preview_url: track.preview_url,
                image: track.album.images,
                release_date: track.album.release_date,
                popularity: track.popularity,
                nationality: nationality,
            };
        } catch (error) {
            console.error('Erreur dans getRandomTrack :', error.message);
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 500)); // Petite pause pour éviter le spam d'erreurs
        }
    }

    throw new Error("Impossible de récupérer une track après plusieurs tentatives.");
}
