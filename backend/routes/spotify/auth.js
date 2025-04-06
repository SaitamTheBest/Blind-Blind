import express from 'express';
import axios from "axios";

const router = express.Router();

// Route pour récupérer un token d'accès Spotify
router.get('/token', async (req, res) => {
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

export default router;