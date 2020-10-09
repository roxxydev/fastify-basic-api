'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Knex = require('knex');
const KnexCleaner = require('knex-cleaner');
const Server = require('../src/server');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;


describe('lib', () => {

    let app;

    const environment = {
        APP_HOST:  '127.0.0.1',
        APP_PORT: 8080,
        API_PREFIX: 'apis',
        API_VERSION: 'v0',
        TOKEN_SECRET: 'T0k3nS3cr3tT3st',
        TOKEN_KEY: 'notSoSecretTestKey',
        TOKEN_ISSUER: 'api.basic.fastify.test',
        TOKEN_EXPIRES: '30000',
        DB_SQL_CLIENT: 'pg',
        DB_SQL_HOST: 'localhost',
        DB_SQL_USER: 'postgres',
        DB_SQL_PASSWORD: 'postgres',
        DB_SQL_NAME: 'testdb',
        DB_SQL_PORT: 5432
    };

    lab.before(async () => {

        console.log('Initializing test server instance...');
        app = await Server(environment);
    });

    lab.after(async () => {

        console.log('Test clean up...');

        const knex = app.knex || Knex({
            client: environment.DB_SQL_CLIENT,
            connection: {
                host: environment.DB_SQL_HOST,
                user: environment.DB_SQL_USER,
                password: environment.DB_SQL_PASSWORD,
                database: environment.DB_SQL_NAME,
                port: environment.DB_SQL_PORT
            }
        });

        if (knex) {
            await KnexCleaner.clean(knex);
            console.log('Knex clean up finished!');
        }
    });

    it('POST /account/register', async () => {

        const payload = {
            username: 'jdoe001',
            password: 'P@ssw0rd!'
        };

        await app.inject({
            method: 'POST',
            url: `${app.prefix}/account/register`,
            payload
        }, (error, response) => {

            expect(response).to.be.an.object;
            expect(error).to.be.null;
        });
    });

    it('GET /account/:accountId', async () => {

    });
});
