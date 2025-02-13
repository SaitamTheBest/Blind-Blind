import getAllTracks from "./getAllTracks.js";

let cachedTrack = null;
let lastUpdatedDate = null;

export default async function getRandomTrack(token) {
    const today = new Date().toISOString().split('T')[0];

    // Vérifie si la musique du jour est déjà stockée
    if (lastUpdatedDate === today && cachedTrack) {
        console.log("Utilisation de la musique du cache :", cachedTrack.name);
        return cachedTrack;
    }

    console.log("Sélection d'une nouvelle musique depuis la playlist...");

    try {
        // Récupère toutes les musiques de la playlist
        const allTracks = await getAllTracks(token);

        if (!allTracks || allTracks.length === 0) {
            throw new Error("Aucune musique trouvée dans la playlist.");
        }

        // Sélectionne une musique aléatoire
        const randomTrack = allTracks[Math.floor(Math.random() * allTracks.length)];

        // Stocke la musique du jour
        cachedTrack = randomTrack;
        lastUpdatedDate = today;

        return cachedTrack;
    } catch (error) {
        console.error("Erreur lors de la sélection de la musique du jour :", error.message);
        throw new Error("Impossible de sélectionner une musique.");
    }
}