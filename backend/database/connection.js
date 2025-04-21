import mysql from 'mysql2/promise';
import { createTunnel } from 'tunnel-ssh';
import { currentConfig } from '../config/config.js';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;
let tunnelInitialized = false;

export async function createTunnelAndConnect() {
    const sshOptions = {
        host: process.env.SSH_HOST,
        port: process.env.SSH_PORT,
        username: process.env.SSH_USER,
        password: process.env.SSH_PASSWORD,
    };

    const forwardOptions = {
        srcHost: '127.0.0.1',
        srcPort: process.env.SRC_PORT,
        dstHost: '127.0.0.1',
        dstPort: process.env.DST_PORT,
    };

    const tunnelOptions = {
        keepAlive: true,
    };

    const serverOptions = {
        port: process.env.SERVER_PORT,
    };

    if (!tunnelInitialized) {
        try {
            const [server, client] = await createTunnel(
                tunnelOptions,
                serverOptions,
                sshOptions,
                forwardOptions
            );

            pool = mysql.createPool({
                host: '127.0.0.1',
                port: process.env.SERVER_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_USER_PASSWORD,
                database: currentConfig.db.database
            });

            tunnelInitialized = true;
        } catch (err) {
            console.error('Erreur lors de la création du tunnel ou de la connexion MySQL :', err);
            throw err;
        }
    }
}

export async function getDbConnection() {
    if (!tunnelInitialized) {
        await createTunnelAndConnect();
    }

    return await pool.getConnection();
}
