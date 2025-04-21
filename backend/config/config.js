import dotenv from 'dotenv';
dotenv.config();

const ENV = process.env.NODE_ENV || 'dev';

const config = {
    dev: {
        db: {
            host: '127.0.0.1',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'blindblind_dev',
            port: process.env.SRC_PORT,
        },
        swaggerTitle: 'API Blind-Blind [DEV]',
    },
    prod: {
        db: {
            host: '127.0.0.1',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'blindblind_prod',
            port: process.env.SRC_PORT,
        },
        swaggerTitle: 'API Blind-Blind [PROD]',
    },
};

export const currentConfig = config[ENV];
