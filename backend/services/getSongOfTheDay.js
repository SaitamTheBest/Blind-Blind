import { getDbConnection } from '../database/connection.js';

async function getSongOfTheDay() {
    let connection;

    try {
        connection = await getDbConnection();

        const [rows] = await connection.execute(`
      SELECT s.track_id, s.found_count, s.created_at, 
             t.name, 
             t.album, 
             t.release_year, 
             t.spotify_url, 
             t.preview_url, 
             t.image_url,
             t.performer_type,
             t.popularity,
             GROUP_CONCAT(a.name) AS artists,
             GROUP_CONCAT(DISTINCT a.genres) AS genres,
             GROUP_CONCAT(DISTINCT a.Nationality) AS nationality,
             GROUP_CONCAT(DISTINCT a.followers) AS followers -- Ajout des followers
      FROM song_of_the_day s
      JOIN tracks t ON s.track_id = t.id
      LEFT JOIN track_artists ta ON t.id = ta.track_id
      LEFT JOIN artists a ON ta.artist_id = a.id
      GROUP BY s.track_id, s.found_count, s.created_at, t.name, t.album, t.release_year, t.spotify_url, t.preview_url, t.image_url, t.popularity
      ORDER BY s.created_at DESC
      LIMIT 1;
    `);

        if (!rows.length) return null;

        const track = rows[0];

        return {
            track_id: track.track_id,
            name: track.name,
            artists: track.artists?.split(',').map(a => a.trim()) || [],
            album: track.album,
            release_year: track.release_year,
            spotify_url: track.spotify_url,
            preview_url: track.preview_url,
            image: track.image_url,
            popularity: track.popularity,
            followers: Number(track.followers),
            nationality: [...new Set(track.nationality?.split(',').map(n => n.trim()).filter(Boolean))] || [],
            genres: [...new Set(track.genres?.split(',').map(g => g.trim()).filter(Boolean))] || ["Aucune donnée"],
            performer_type: track.performer_type || "",
        };
    } catch (error) {
        console.error('Erreur MySQL (getSongOfTheDay) :', error);
        return null;
    } finally {
        if (connection) await connection.release();
    }
}

export default getSongOfTheDay;
