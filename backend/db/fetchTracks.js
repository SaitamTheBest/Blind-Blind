import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import axios from 'axios';

console.log("🔍 Vérification des variables d'environnement...");
console.log("SPOTIFY_CLIENT_ID:", process.env.SPOTIFY_CLIENT_ID);
console.log("SPOTIFY_CLIENT_SECRET:", process.env.SPOTIFY_CLIENT_SECRET ? "****" : "Non défini");
console.log("ID_PLAYLIST:", process.env.ID_PLAYLIST);

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    console.error("❌ Erreur: Les variables d'environnement ne sont pas correctement définies.");
    process.exit(1);
}

const DATABASE_PATH = 'music.db';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const OFFSET = 100; // constante pour récupérer les morceaux de x+1 à x+100

/**
 * Récupère un token d'accès à l'API Spotify
 */
async function getSpotifyToken() {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({ grant_type: 'client_credentials' }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                auth: {
                    username: process.env.SPOTIFY_CLIENT_ID,
                    password: process.env.SPOTIFY_CLIENT_SECRET
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du token Spotify:", error.response?.data || error);
        process.exit(1);
    }
}

/**
 * Récupère les genres, followers et image d'un artiste depuis Spotify
 */
async function getArtistDetails(artistId, token, db) {
    const existingArtist = await db.get(`SELECT genres, followers, image_url FROM artists WHERE id = ?`, [artistId]);

    if (existingArtist && existingArtist.genres) {
        console.log(`✅ Infos déjà enregistrées pour l'artiste ${artistId}, pas d'appel API.`);
        return {
            genres: existingArtist.genres,
            followers: existingArtist.followers,
            image_url: existingArtist.image_url
        };
    }

    try {
        const response = await axios.get(`${SPOTIFY_API_URL}/artists/${artistId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return {
            genres: response.data.genres.join(', '),
            followers: response.data.followers.total,
            image_url: response.data.images?.[0]?.url || null
        };
    } catch (error) {
        console.error(`❌ Erreur lors de la récupération des détails pour l'artiste ${artistId}:`, error.response?.data || error);
        return { genres: null, followers: null, image_url: null };
    }
}

/**
 * Récupère les tracks Spotify avec l'offset défini
 */
async function fetchTracks() {
    console.log(`📌 Début de la récupération à partir de l'offset : ${OFFSET}`);

    console.log("📂 Connexion à SQLite...");
    const db = await open({ filename: DATABASE_PATH, driver: sqlite3.Database });

    console.log("🔑 Récupération du token Spotify...");
    const token = await getSpotifyToken();

    console.log("📥 Récupération des musiques depuis Spotify...");
    try {
        const response = await axios.get(
            `${SPOTIFY_API_URL}/playlists/${process.env.ID_PLAYLIST}/tracks?limit=100&offset=${OFFSET}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const tracks = response.data.items;
        console.log(`🎧 ${tracks.length} musiques récupérées !`);

        for (const item of tracks) {
            const track = item.track;
            if (!track) continue;

            const trackId = track.id;
            const name = track.name;
            const album = track.album?.name || null;
            const releaseYear = track.album?.release_date?.split('-')[0] || null;
            const spotifyUrl = track.external_urls?.spotify || null;
            const previewUrl = track.preview_url || null;
            const imageUrl = track.album?.images?.[0]?.url || null;
            const popularity = track.popularity || 0;

            console.log(`📌 Insertion: ${name} - Album: ${album}`);

            await db.run(
                `INSERT OR IGNORE INTO tracks (id, name, album, release_year, spotify_url, preview_url, image_url, popularity) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [trackId, name, album, releaseYear, spotifyUrl, previewUrl, imageUrl, popularity]
            );

            for (const artist of track.artists) {
                const artistId = artist.id;
                const artistName = artist.name;

                const artistDetails = await getArtistDetails(artistId, token, db);

                await db.run(
                    `INSERT OR IGNORE INTO artists (id, name, genres, followers, image_url) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [artistId, artistName, artistDetails.genres, artistDetails.followers, artistDetails.image_url]
                );

                await db.run(
                    `INSERT OR IGNORE INTO track_artists (track_id, artist_id) 
                     VALUES (?, ?)`,

                    [trackId, artistId]
                );
            }
        }

        console.log("🎉 Données enregistrées avec succès !");
        await db.close();

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des tracks:", error.response?.data || error);
    }
}

// Exécution pour récupérer les morceaux de 201 à 300
fetchTracks();
