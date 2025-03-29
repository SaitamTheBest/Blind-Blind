import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function getAllTracks() {
    const db = await open({
        filename: './db/music.db',
        driver: sqlite3.Database
    });

    try {
        const tracks = await db.all(`
            SELECT
                t.id AS track_id,
                t.name,
                t.album,
                t.release_year,
                t.spotify_url,
                t.preview_url,
                t.image_url AS image,
                t.popularity,
                a.followers,
                a.image_url,
                a.Nationality as nationality,
                t.performer_type,
                GROUP_CONCAT(a.name, ', ') AS artists,
                GROUP_CONCAT(a.genres, ', ') AS genres
            FROM tracks t
                     LEFT JOIN track_artists ta ON t.id = ta.track_id
                     LEFT JOIN artists a ON ta.artist_id = a.id
            GROUP BY t.id
            ORDER BY t.popularity DESC;
        `);

        return tracks.map(track => {
            const artists = track.artists ? track.artists.split(',').map(a => a.trim()) : [];
            let genres = track.genres
                ? track.genres
                    .split(',')
                    .map(g => g.trim())
                    .filter(g => g !== '')
                : [];

            if (genres.length === 0) {
                genres = ["Aucune donnée"];
            }

            return {
                ...track,
                artists,
                genres,
                nationality: track.nationality || "Inconnue"
            };
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des tracks :', error);
        return { error: 'Impossible de récupérer les tracks.' };
    } finally {
        await db.close();
    }
}

export default getAllTracks;
