import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';

const DATABASE_PATH = './db/music.db';

async function setupDatabase() {
    console.log("📂 Création de la base SQLite...");

    const db = await open({
        filename: DATABASE_PATH,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS artists (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            genres TEXT,
            followers INTEGER,
            image_url TEXT,
            Nationality TEXT
        );
        
        CREATE TABLE IF NOT EXISTS tracks (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            album TEXT,
            release_year INTEGER,
            spotify_url TEXT,
            preview_url TEXT,
            image_url TEXT,
            popularity INTEGER
        );

        CREATE TABLE IF NOT EXISTS track_artists (
            track_id TEXT NOT NULL,
            artist_id TEXT NOT NULL,
            PRIMARY KEY (track_id, artist_id),
            FOREIGN KEY (track_id) REFERENCES tracks(id),
            FOREIGN KEY (artist_id) REFERENCES artists(id)
        );
    `);

    console.log("✅ Base de données initialisée !");
    await db.close();
}

// 🚀 Exécuter le script
setupDatabase().catch(console.error);
