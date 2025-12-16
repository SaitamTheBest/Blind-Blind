import { getDbConnection } from '../../database/connection.js';

async function getAllArtists() {
    let connection;

    try {
        connection = await getDbConnection();

        const [rows] = await connection.execute(`
            SELECT DISTINCT
                a.id,
                a.name
            FROM artists a
            ORDER BY a.name ASC;
        `);

        return rows;

    } catch (error) {
        console.error('Erreur MySQL (getAllArtists) :', error);
        return { error: 'Erreur lors de la récupération des artistes' };
    } finally {
        if (connection) await connection.release();
    }
}

export default getAllArtists;
