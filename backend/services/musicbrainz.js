import axios from "axios";

// Fonction pour récupérer la nationalité d'un artiste depuis l'API MusicBrainz
export default async function getArtistNationality(artistName) {
    const baseUrl = 'https://musicbrainz.org/ws/2/artist/';
    try {
        //On récupère la nationalité de l'artiste
        const response = await axios.get(baseUrl, {
            params: {
                query: `artist:${artistName}`,
                fmt: 'json',
            },
        });

        const artists = response.data.artists;

        if (artists.length === 0) {
            console.warn(`Aucun artiste trouvé pour le nom : ${artistName}`);
            return null;
        }

        // On retourne la nationalité de l'artiste trouvé dans randomTrack.js
        return artists[0].country || 'Inconnu';
    } catch (error) {
        console.error(`Erreur lors de la recherche de la nationalité pour ${artistName}:`, error.message);
        return 'Erreur';
    }
}