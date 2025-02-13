import express from 'express';
import axios from "axios";
import getRandomTrack from '../services/randomTrack.js';
import { PORT } from '../app.js';
import getAllTracks from "../services/getAllTracks.js";

const router = express.Router();

// Route pour récupérer une track/musique aléatoire avec un filtre sur la nationalité
router.get('/random-track', async (req, res) => {
    try {
        const filterNationality = req.query.nationality;
        const tokenResponse = await axios.get(`http://localhost:${PORT}/api/auth/token`);
        const token = tokenResponse.data.access_token;

        const track = await getRandomTrack(token, filterNationality);
        res.json(track);
    } catch (error) {
        console.error('Problème rencontré dans /api/random-track :', error);
        res.status(500).json({ error: 'Impossible de récupérer une track/musique aléatoire.' });
    }
});

// Route pour récupérer toutes les tracks/musiques
router.get('/all-tracks', async (req, res) => {
    try {
        const tokenResponse = await axios.get(`http://localhost:${PORT}/api/auth/token`);
        const token = tokenResponse.data.access_token;

        const tracks = await getAllTracks(token);
        res.json(tracks);
    } catch (error) {
        console.error('Problème rencontré dans /api/all-tracks :', error);
        res.status(500).json({ error: 'Impossible de récupérer toutes les tracks/musiques.' });
    }
});

export default router;