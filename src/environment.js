'use strict';

const Dotenv = require('dotenv');
const Path = require('path');


Dotenv.config({ path: Path.resolve(__dirname, '../.env') });

const prefix = process.env.NODE_ENV ? `${process.env.NODE_ENV}_` : '';

const enviroment = {
    APP_HOST: process.env[`${prefix}APP_HOST`] || '127.0.0.1',
    APP_PORT: process.env[`${prefix}APP_PORT`] || 8080,
    API_PREFIX: process.env[`${prefix}API_PREFIX`] || 'apis',
    API_VERSION: process.env[`${prefix}API_VERSION`] || 'v0',
    TOKEN_SECRET: process.env[`${prefix}TOKEN_SECRET`] || 'T0k3nS3cr3t',
    TOKEN_KEY: process.env[`${prefix}TOKEN_KEY`] || 'notSoSecret',
    TOKEN_ISSUER: process.env[`${prefix}TOKEN_ISSUER`] || 'api.basic.fastify',
    TOKEN_EXPIRES: process.env[`${prefix}TOKEN_EXPIRES`] || '30000',
    DB_CLIENT: process.env[`${prefix}DB_CLIENT`] || 'pg',
    DB_HOST: process.env[`${prefix}DB_HOST`] || 'localhost',
    DB_USER: process.env[`${prefix}DB_USER`] || 'postgres',
    DB_PASSWORD: process.env[`${prefix}DB_PASSWORD`] || 'postgres',
    DB_NAME: process.env[`${prefix}DB_NAME`] || 'fastify',
    DB_PORT: process.env[`${prefix}DB_PORT`] || 5432
};

module.exports = enviroment;
