'use strict';

const Dotenv = require('dotenv');
const Path = require('path');
const Fs = require('fs');

Dotenv.config({ path: Path.resolve(__dirname, '../.env') });

let envPath;
const NODE_ENV = process.env.NODE_ENV;

switch (NODE_ENV) {
    case 'development':
        envPath = Path.resolve(__dirname, '../.env.development');
    break;
    case 'staging':
        envPath = Path.resolve(__dirname, '../.env.staging');
    break;
    case 'production':
        envPath = Path.resolve(__dirname, '../.env.production');
    break;
    default:
        envPath = Path.resolve(__dirname, '../.env.local');
    break;
};

if (envPath && Fs.existsSync(envPath)) {
    Dotenv.config({ path: envPath });
}

const enviroment = {
  NODE_ENV,
  APP_HOST: process.env.APP_HOST || '127.0.0.1',
  APP_PORT: process.env.APP_PORT || 8080,
  API_PREFIX: process.env.API_PREFIX || 'apis',
  API_VERSION: process.env.API_VERSION || 'v0',
  DB_SQL_CLIENT: process.env.DB_SQL_CLIENT || 'pg',
  DB_SQL_HOST: process.env.DB_SQL_HOST || 'localhost',
  DB_SQL_USER: process.env.DB_SQL_USER || 'postgres',
  DB_SQL_PASSWORD: process.env.DB_SQL_PASSWORD || 'postgres',
  DB_SQL_NAME: process.env.DB_SQL_NAME || 'fastify',
  DB_SQL_PORT: process.env.DB_SQL_PORT || 5432
};

module.exports = enviroment;
