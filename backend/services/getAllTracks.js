import { getDbConnection } from '../database/connection.js';

async function getAllTracks() {
    let connection;
    try {
        connection = await getDbConnection();

        const [rows] = await connection.execute(`
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
            GROUP_CONCAT(a.Nationality) as nationality,
            t.performer_type,
            GROUP_CONCAT(a.name) AS artists,
            GROUP_CONCAT(a.genres) AS genres
        FROM tracks t
            LEFT JOIN track_artists ta ON t.id = ta.track_id
            LEFT JOIN artists a ON ta.artist_id = a.id
        GROUP BY t.id, t.name, t.album, t.release_year, t.spotify_url, t.preview_url, t.image_url, t.popularity, a.followers, a.image_url, t.performer_type
        ORDER BY t.popularity DESC;

    `);

        return rows.map(track => {
            const artists = track.artists?.split(',').map(a => a.trim()) || [];
            const genres = [...new Set(track.genres?.split(',').map(g => g.trim()).filter(Boolean))] || ["Aucune donnée"];
            const nationalities = [...new Set(track.nationality?.split(',').map(n => n.trim()).filter(Boolean))] || [];

            return {
                ...track,
                artists,
                genres,
                nationality: nationalities,
            };
        });
    } catch (error) {
        console.error('Erreur MySQL :', error);
        return { error: 'Erreur lors de la récupération des données' };
    } finally {
        if (connection) await connection.release();
    }
}

export default getAllTracks;
