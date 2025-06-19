import { getDbConnection } from '../database/connection.js';

async function incrementFoundCount() {
    let connection;

    try {
        connection = await getDbConnection();

        const [rows] = await connection.execute(`
      SELECT id FROM song_of_the_day
      ORDER BY created_at DESC
      LIMIT 1;
    `);

        if (!rows.length) {
            console.warn("Aucune chanson du jour à mettre à jour.");
            return { success: false, message: "Aucune chanson du jour trouvée." };
        }

        const songId = rows[0].id;

        await connection.execute(`
      UPDATE song_of_the_day
      SET found_count = found_count + 1
      WHERE id = ?;
    `, [songId]);

        return { success: true };
    } catch (error) {
        console.error("Erreur dans incrementFoundCount :", error);
        return { success: false, error: "Erreur MySQL" };
    } finally {
        if (connection) await connection.release();
    }
}

export default incrementFoundCount;
