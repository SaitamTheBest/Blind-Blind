const axios = require('axios'); // Axios étant un module nous permettant de faire des requêtes HTTP
const { getArtistNationality } = require('./musicbrainz'); // Import de la fonction pour récupérer la nationalité d'un artiste


async function getRandomTrack(token) {
    const baseUrl = 'https://api.spotify.com/v1/search';

    while (true) { // Boucle pour continuer à chercher jusqu'à trouver une track correspondant au filtre
        try {
            // On génère un caractère aléatoire entre 'a' et 'z' pour effectuer une recherche aléatoire
            const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); 

            // Paramètres de la requête pour l'API Spotify
            const params = {
                q: randomChar, // Recherche basée sur une lettre aléatoire
                type: 'track', // Recherche uniquement des morceaux
                limit: 1, // Limite le résultat à un seul morceau
                offset: Math.floor(Math.random() * 1000), // Décalage aléatoire pour varier les résultats
                market: 'FR', // Limite les résultats au marché français
            };

            // Requête vers l'API Spotify pour récupérer un morceau aléatoire
            const response = await axios.get(baseUrl, {
                headers: { Authorization: `Bearer ${token}` }, // On ajoute le token d'accès dans les en-têtes
                params, // ON ajoute les paramètres de recherche
            });

            // Récupère le premier morceau des résultats
            const track = response.data.tracks.items[0];
            if (!track) throw new Error('Aucune track trouvée.');

            // Récupère le nom du premier artiste lié au morceau
            const artistName = track.artists[0].name;

            // On récupère la nationalité de l'artiste via la fonction getArtistNationality
            const nationality = await getArtistNationality(artistName);
            
            return {
                name: track.name, // Nom de la musique
                artists: track.artists.map((artist) => artist.name).join('; '), // Liste des artistes
                album: track.album.name, // Nom de l'album
                link: track.external_urls.spotify, // Lien vers le morceau sur Spotify
                preview_url: track.preview_url, // URL pour écouter un extrait du morceau
                image: track.album.images, // Liste des images de l'album (3 tailles disponibles)
                release_date: track.album.release_date, // Date de sortie du morceau (sur Spotify)
                popularity: track.popularity, // Popularité du morceau (0 à 100 n'étant pas les streams du morceau)
                nationality: nationality, // Nationalité de l'artiste cité plus haut
            };
        } catch (error) {
            console.error('Erreur dans getRandomTrack :', error.message);
            throw error; // Relance l'erreur pour qu'elle soit gérée en amont
        }
    }
}

// Export de la fonction pour l'utiliser dans app.js
module.exports = { getRandomTrack };