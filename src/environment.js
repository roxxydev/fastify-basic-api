'use strict';

const Dotenv = require('dotenv');
const Path = require('path');

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

Dotenv.config({ path: envPath });

const enviroment = {
  NODE_ENV,
  APP_HOST: process.env.APP_HOST || '127.0.0.1',
  APP_PORT: process.env.APP_PORT || 8080,
  DB_SQL_CLIENT: process.env.DB_SQL_CLIENT,
  DB_SQL_HOST: process.env.DB_SQL_HOST,
  DB_SQL_USER: process.env.DB_SQL_USER,
  DB_SQL_PASSWORD: process.env.DB_SQL_PASSWORD,
  DB_SQL_NAME: process.env.DB_SQL_NAME,
  DB_SQL_PORT: process.env.DB_SQL_PORT
};

module.exports = enviroment;
