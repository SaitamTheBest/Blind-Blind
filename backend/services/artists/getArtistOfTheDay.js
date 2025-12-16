import { getDbConnection } from '../../database/connection.js';

async function getArtistOfTheDay() {
    let connection;

    try {
        connection = await getDbConnection();

        const [rows] = await connection.execute(`
            SELECT
                a.id AS artist_id,
                a.name AS artist_name,
                a.image_url AS artist_image,
                a.followers,
                a.genres,
                a.Nationality AS nationality,

                t.id AS track_id,
                t.name AS track_name,
                t.album,
                t.release_year,
                t.spotify_url,
                t.preview_url,
                t.image_url AS track_image,
                t.popularity AS track_popularity,
                t.performer_type,

                ad.found_count,
                ad.created_at

            FROM artist_of_the_day ad
            JOIN artists a ON ad.artist_id = a.id
            JOIN track_artists ta ON ta.artist_id = a.id
            JOIN tracks t ON t.id = ta.track_id

            WHERE t.popularity = (
                SELECT MAX(t2.popularity)
                FROM track_artists ta2
                JOIN tracks t2 ON t2.id = ta2.track_id
                WHERE ta2.artist_id = a.id
            )

            ORDER BY ad.created_at DESC
            LIMIT 1;
        `);

        if (!rows.length) return null;

        const row = rows[0];

        const uniqueList = (value, defaultValue = []) => {
            if (!value) return defaultValue;
            return [...new Set(
                value.split(',').map(v => v.trim()).filter(Boolean)
            )];
        };

        return {
            artist_id: row.artist_id,
            name: row.artist_name,
            image: row.artist_image,
            followers: Number(row.followers),
            genres: uniqueList(row.genres, ["Aucune donnée"]),
            nationality: uniqueList(row.nationality),

            top_track: {
                id: row.track_id,
                name: row.track_name,
                album: row.album,
                release_year: row.release_year,
                spotify_url: row.spotify_url,
                preview_url: row.preview_url,
                image: row.track_image,
                popularity: row.track_popularity,
                performer_type: row.performer_type
            },

            found_count: row.found_count,
            created_at: row.created_at
        };

    } catch (error) {
        console.error('Erreur MySQL (getArtistOfTheDay) :', error);
        return null;
    } finally {
        if (connection) await connection.release();
    }
}

export default getArtistOfTheDay;
