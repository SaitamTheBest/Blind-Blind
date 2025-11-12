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
                t.performer_type,
                (
                    SELECT SUM(DISTINCT a2.followers)
                    FROM track_artists ta2
                             JOIN artists a2 ON ta2.artist_id = a2.id
                    WHERE ta2.track_id = t.id
                ) AS followers,
                (
                    SELECT a3.image_url
                    FROM track_artists ta3
                    JOIN artists a3 ON ta3.artist_id = a3.id
                    WHERE ta3.track_id = t.id AND a3.image_url IS NOT NULL AND a3.image_url != ''
                    ORDER BY ta3.artist_id
                    LIMIT 1
                ) AS image_url,
                GROUP_CONCAT(DISTINCT a.name) AS artists,
                GROUP_CONCAT(DISTINCT a.genres) AS genres,
                GROUP_CONCAT(DISTINCT a.Nationality) AS nationality
            FROM tracks t
                LEFT JOIN track_artists ta ON t.id = ta.track_id
                LEFT JOIN artists a ON ta.artist_id = a.id
            GROUP BY t.id, t.name, t.album, t.release_year, t.spotify_url, t.preview_url, t.image_url, t.popularity, t.performer_type
            ORDER BY t.popularity DESC;
        `);

        return rows.map(track => {
            const uniqueList = (value, defaultValue = []) => {
                if (!value) return defaultValue;
                return [...new Set(value.split(',')
                    .map(v => v.trim())
                    .filter(Boolean))];
            };
            const artists = uniqueList(track.artists);
            const genres = uniqueList(track.genres, ["Aucune donnée"]);
            const nationalities = uniqueList(track.nationality);

            return {
                ...track,
                followers: Number(track.followers),
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
