import getAllTracks from "./getAllTracks.js";
import getArtistNationality from "./musicbrainz.js";

let cachedTrack = null;
let lastUpdateDate = null;
let allTracksCache = [];

export default async function getRandomTrack(token) {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    const targetTime = "00:00";

    const targetDateToday = `${year}-${month}-${day} ${targetTime}`;

    console.log("Heure actuelle :", currentDate);

    // Vérification si la musique a déjà été récupérée aujourd'hui après l'heure cible
    if (cachedTrack && lastUpdateDate === targetDateToday) {
        console.log("Utilisation de la musique mise en cache.");
        return cachedTrack;
    }

    // Si l'heure actuelle est avant 14h25, on ne fait rien
    if (currentDate < targetDateToday) {
        console.log(`Ce n'est pas encore l'heure (${targetTime}), attente...`);
        return null;
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

        lastUpdateDate = targetDateToday; // On stocke la date exacte pour éviter un nouveau tirage
        return cachedTrack;
    } catch (error) {
        console.error('Erreur dans getRandomTrack :', error.message);
        throw new Error("Impossible de récupérer une track aléatoire.");
    }
}