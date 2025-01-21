const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour gérer les requêtes HTTP (CORS et JSON)
app.use(cors());
app.use(express.json());

// Route pour récupérer un token d'accès Spotify
app.get('/auth/token', async (req, res) => {
    try {
        const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

        // Vérification des variables nécessaires pour l'authentification
        if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
            return res.status(500).json({
                error: 'SPOTIFY_CLIENT_ID ou SPOTIFY_CLIENT_SECRET absents dans la configuration.',
            });
        }

        // Requête pour obtenir un token d'accès via les clés Client ID et Secret
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            null,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                auth: {
                    username: SPOTIFY_CLIENT_ID, // Doit être configuré dans le fichier .env
                    password: SPOTIFY_CLIENT_SECRET, // Idem, à configurer dans .env
                },
                params: {
                    grant_type: 'client_credentials', // Permet d'obtenir un token d'accès
                },
            }
        );

        // Renvoie le token récupéré pour les futures requêtes
        res.json(response.data);
    } catch (error) {
        console.error('Problème rencontré dans /auth/token :', error.message);
        res.status(500).json({ error: 'Échec lors de la récupération du token Spotify.' });
    }
});

// Fonction pour récupérer une musique au hasard
async function getRandomTrack(token) {
    const baseUrl = 'https://api.spotify.com/v1/search';

    try {
        // Génère un caractère aléatoire pour effectuer une recherche
        const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Génère une lettre minuscule a-z

        // Définit les paramètres de la requête
        const params = {
            q: randomChar, // Recherche basée sur une lettre aléatoire
            type: 'track', // Recherche uniquement des morceaux
            limit: 1,      // Limite le résultat à une seule track/musique
            offset: Math.floor(Math.random() * 1000), // Permet de varier les résultats avec un décalage
        };

        console.log('Paramètres envoyés pour la recherche Spotify:', params);

        // Envoie la requête pour récupérer une track/musique aléatoire
        const response = await axios.get(baseUrl, {
            headers: {
                Authorization: `Bearer ${token}`, // Ajoute le token d'accès dans l'en-tête
            },
            params,
        });

        // Récupère la première track/musique des résultats
        const track = response.data.tracks.items[0];
        if (!track) throw new Error('Aucune track/musique trouvée.');

        // Retourne les détails de la track/musique sélectionnée
        return {
            name: track.name,
            artists: track.artists.map((artist) => artist.name).join(', '),
            album: track.album.name,
            link: track.external_urls.spotify,
            preview_url: track.preview_url,
        };
    } catch (error) {
        console.error('Erreur rencontrée dans getRandomTrack :', error.message);
        throw error;
    }
}

// Route pour récupérer une track/musique aléatoire à partir de Spotify
app.get('/api/random-track', async (req, res) => {
    try {
        // Appel de la route /auth/token pour obtenir un token valide
        const tokenResponse = await axios.get(`http://localhost:${PORT}/auth/token`);
        const token = tokenResponse.data.access_token;

        // Appelle la fonction pour récupérer une track/musique aléatoire
        const track = await getRandomTrack(token);
        res.json(track);
    } catch (error) {
        console.error('Problème rencontré dans /api/random-track :', error.message);
        res.status(500).json({ error: 'Impossible de récupérer une track/musique aléatoire.' });
    }
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur http://localhost:${PORT}`);
});