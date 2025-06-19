import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import authRoutes from './routes/spotify/auth.js';
import tracksRoutes from './routes/tracks.js';
import {currentConfig} from "./config/config.js";

dotenv.config();

const app = express();
export const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: currentConfig.swaggerTitle,
            version: '1.0.0',
            description: 'Documentation de l’API Blind-Blind',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./routes/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracks', tracksRoutes);

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur http://localhost:${PORT}`);
    console.log(`Swagger dispo sur http://localhost:${PORT}/api-docs`);
});
