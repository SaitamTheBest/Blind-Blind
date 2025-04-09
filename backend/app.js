import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/spotify/auth.js';
import tracksRoutes from './routes/tracks.js';

dotenv.config();

const app = express();
export const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracks', tracksRoutes);

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur http://localhost:${PORT}`);
});
