const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

// Import de la fonction getRandomTrack depuis randomTrack.js
const { getRandomTrack } = require('./randomTrack');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour gérer les requêtes HTTP (CORS et JSON)
app.use(cors());
app.use(express.json());

// Route pour récupérer un token d'accès Spotify
app.get('/auth/token', async (req, res) => {
    try {
        const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

        if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
            return res.status(500).json({
                error: 'SPOTIFY_CLIENT_ID ou SPOTIFY_CLIENT_SECRET absents dans la configuration.',
            });
        }

        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            null,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                auth: {
                    username: SPOTIFY_CLIENT_ID,
                    password: SPOTIFY_CLIENT_SECRET,
                },
                params: {
                    grant_type: 'client_credentials',
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Problème rencontré dans /auth/token :', error.message);
        res.status(500).json({ error: 'Échec lors de la récupération du token Spotify.' });
    }
});

// Route pour récupérer une track/musique aléatoire avec un filtre sur la nationalité
app.get('/api/random-track', async (req, res) => {
    try {
        const filterNationality = req.query.nationality; // Exemple: ?nationality=US
        const tokenResponse = await axios.get(`http://localhost:${PORT}/auth/token`);
        const token = tokenResponse.data.access_token;

        const track = await getRandomTrack(token, filterNationality);
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