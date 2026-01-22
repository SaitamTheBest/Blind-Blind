import express from 'express';
import axios from "axios";
import { PORT } from '../app.js';
import getAllTracks from "../services/tracks/getAllTracks.js";
import getSongOfTheDay from "../services/tracks/getSongOfTheDay.js";
import incrementFoundCount from "../services/incrementFoundCount.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tracks
 *   description: Gestion des musiques
 */

/**
 * @swagger
 * /api/tracks/all-tracks:
 *   get:
 *     summary: Récupère la liste des tracks
 *     tags: [Tracks]
 *     responses:
 *       200:
 *         description: Succès
 */
router.get('/all-tracks', async (req, res) => {
    try {
        const tracks = await getAllTracks();

        res.json(tracks);
    } catch (error) {
        console.error('Problème rencontré dans /api/all-tracks :', error);
        res.status(500).json({ error: 'Impossible de récupérer toutes les tracks/musiques.' });
    }
});

/**
 * @swagger
 * /api/tracks/song-of-the-day:
 *   get:
 *     summary: Récupère la chanson du jour
 *     tags: [Tracks]
 *     responses:
 *       200:
 *         description: Succès
 *       404:
 *         description: Aucune chanson du jour trouvée
 */
router.get('/song-of-the-day', async (req, res) => {
    try {
        const song = await getSongOfTheDay();
        if (!song) {
            return res.status(404).json({ error: "Aucune chanson du jour trouvée." });
        }
        res.json(song);
    } catch (error) {
        console.error("Erreur dans /api/tracks/song-of-the-day :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});


/**
 * @swagger
 * /api/tracks/song-of-the-day/found:
 *   post:
 *     summary: Incrémente le compteur de succès pour la chanson du jour
 *     tags: [Tracks]
 *     responses:
 *       200:
 *         description: Succès
 *       404:
 *         description: Aucune chanson du jour trouvée
 *       500:
 *         description: Erreur serveur
 */
router.post('/song-of-the-day/found', async (req, res) => {
    try {
        const result = await incrementFoundCount();

        if (!result.success) {
            return res.status(404).json({ error: result.message || "Aucune chanson du jour" });
        }

        res.status(200).json({ message: "Bravo ! 🎉 Nombre de trouvailles mis à jour." });
    } catch (error) {
        console.error("Erreur dans POST /song-of-the-day/found :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;