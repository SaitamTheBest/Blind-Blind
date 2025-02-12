import getAllTracks from "./getAllTracks.js";
import getArtistNationality from "./musicbrainz.js";

let cachedTrack = null;
let lastUpdateDate = null;
let allTracksCache = [];

export default async function getRandomTrack(token) {
    const today = new Date().toISOString().split("T")[13][40];

    if (cachedTrack && lastUpdateDate === today) {
        console.log("Utilisation de la musique mise en cache.");
        return cachedTrack;
    }

    console.log("Récupération de la playlist et choix d'un morceau...");

    try {
        if (allTracksCache.length === 0) {
            allTracksCache = await getAllTracks(token);
        }

        if (allTracksCache.length === 0) {
            throw new Error("Aucune musique disponible dans la playlist.");
        }

        // Sélectionner un morceau aléatoire
        const randomIndex = Math.floor(Math.random() * allTracksCache.length);
        const track = allTracksCache[randomIndex];

        // Récupérer la nationalité de l'artiste principal
        const nationality = await getArtistNationality(track.artists[0]);

        // Structurer la réponse
        cachedTrack = {
            name: track.name,
            artists: track.artists.join('; '),
            album: track.album,
            link: track.link,
            preview_url: track.preview_url,
            image: track.image,
            release_date: track.release_date,
            popularity: track.popularity,
            genres: track.genres,
            nationality: nationality,
        };

        lastUpdateDate = today;
        return cachedTrack;
    } catch (error) {
        console.error('Erreur dans getRandomTrack :', error.message);
        throw new Error("Impossible de récupérer une track aléatoire.");
    }
}