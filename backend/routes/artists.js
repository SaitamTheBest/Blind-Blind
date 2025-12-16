import express from 'express';
import axios from "axios";
import getAllArtists from '../services/artists/getAllArtists.js';
import { PORT } from '../app.js';
import getArtistOfTheDay from "../services/artists/getArtistOfTheDay.js";
import incrementFoundCount from "../services/incrementFoundCount.js";

const router = express.Router();

/**
 * @swagger
 * /api/artists/all-artists:
 *   get:
 *     summary: Récupère la liste des artistes
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: Succès
 */
router.get('/all-artists', async (req, res) => {
    try {
        const artists = await getAllArtists();

        res.json(artists);
    } catch (error) {
        console.error('Problème rencontré dans /api/artists/all-artists :', error);
        res.status(500).json({ error: 'Impossible de récupérer tous les artistes.' });
    }
});

/**
 * @swagger
 * /api/artists/artist-of-the-day:
 *   get:
 *     summary: Récupère l'artiste du jour
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: Succès
 *       404:
 *         description: Aucune chanson du jour trouvée
 */
router.get('/artist-of-the-day', async (req, res) => {
    try {
        const artist = await getArtistOfTheDay();
        if (!artist) {
            return res.status(404).json({ error: "Aucun artiste du jour trouvé." });
        }
        res.json(artist);
    } catch (error) {
        console.error("Erreur dans /api/artists/artist-of-the-day :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});


/**
 * @swagger
 * /api/artists/artist-of-the-day/found:
 *   post:
 *     summary: Incrémente le compteur de succès pour l'artiste du jour
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: Succès
 *       404:
 *         description: Aucune chanson du jour trouvée
 *       500:
 *         description: Erreur serveur
 */
router.post('/artist-of-the-day/found', async (req, res) => {
    try {
        const result = await incrementFoundCount();

        if (!result.success) {
            return res.status(404).json({ error: result.message || "Aucun artiste du jour" });
        }

        res.status(200).json({ message: "Bravo ! 🎉 Nombre de trouvailles mis à jour." });
    } catch (error) {
        console.error("Erreur dans POST /artist-of-the-day/found :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;