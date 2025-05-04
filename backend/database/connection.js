import {currentConfig} from "../config/config.js";
import mysql from "mysql2/promise";
import {createTunnel} from "tunnel-ssh";

let pool = null;
let tunnelInitialized = false;

export async function createTunnelAndConnect() {
    if (tunnelInitialized && pool) return;

    try {
        await new Promise((resolve, reject) => {
            const sshOptions = {
                host: process.env.SSH_HOST,
                port: process.env.SSH_PORT,
                username: process.env.SSH_USER,
                password: process.env.SSH_PASSWORD,
            };

            const forwardOptions = {
                srcHost: '127.0.0.1',
                srcPort: parseInt(process.env.SRC_PORT, 10),
                dstHost: '127.0.0.1',
                dstPort: parseInt(process.env.DST_PORT, 10),
            };

            const tunnelOptions = { keepAlive: true };
            const serverOptions = { port: parseInt(process.env.SERVER_PORT, 10) };

            createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions)
                .then(([server, client]) => {
                    console.log(`Tunnel SSH ouvert sur localhost:${serverOptions.port}`);
                    tunnelInitialized = true;
                    resolve(null);
                })
                .catch(err => {
                    if (err.code === 'EADDRINUSE') {
                        console.warn(`Port ${serverOptions.port} déjà utilisé. Tunnel probablement actif.`);
                        tunnelInitialized = true;
                        resolve(null); // assume tunnel already open
                    } else {
                        reject(err);
                    }
                });
        });

        if (!pool) {
            pool = mysql.createPool({
                host: '127.0.0.1',
                port: parseInt(process.env.SERVER_PORT, 10),
                user: process.env.DB_USER,
                password: process.env.DB_USER_PASSWORD,
                database: currentConfig.db.database,
            });
        }

    } catch (err) {
        console.error('Erreur lors de la création du tunnel ou du pool MySQL :', err);
        throw err;
    }
}

export async function getDbConnection() {
    if (!tunnelInitialized || !pool) {
        await createTunnelAndConnect();
    }
    return await pool.getConnection();
}
