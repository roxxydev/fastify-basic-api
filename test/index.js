'use strict';

const Knex = require('knex');
const KnexCleaner = require('knex-cleaner');
const Server = require('../src/server');
const Tap = require('tap');
const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const Axios = require('axios');
const Environment = require('../src/environment');

const expect = Code.expect;
const lab = exports.lab = Lab.script();

/* eslint-disable prefer-const */
let { it, before, after, describe } = lab;

if (process.env.TEST_USE_TAP) {
    Tap.mochaGlobals();
}

describe('Server', () => {

    let app;
    let knex;
    let address;
    let axios;
    let account;
    const headerToken = {};

    const testAccount = {
        username: 'jdoe1001',
        password: 'P@ssw0rd!'
    };

    const environment = {
        APP_HOST: '127.0.0.1',
        APP_PORT: 8088,
        API_PREFIX: 'apis',
        API_VERSION: 'v0',
        TOKEN_SECRET: 'T0k3nS3cr3tT3st',
        TOKEN_KEY: 'notSoSecretTestKey',
        TOKEN_ISSUER: 'api.basic.fastify.test',
        TOKEN_EXPIRES: '30000',
        DB_CLIENT: 'pg',
        DB_HOST: Environment.DB_HOST,
        DB_USER: Environment.DB_USER,
        DB_PASSWORD: Environment.DB_PASSWORD,
        DB_NAME: 'testdb',
        DB_PORT: Environment.DB_PORT
    };

    before(async () => {

        console.log('x+x+x+x+x+x+x+x+x+x+x+x+ Initializing test server instance x+x+x+x+x+x+x+x+x+x+x+x+x+x+x');

        app = await Server(environment);

        knex = app.knex || Knex({
            client: Environment.DB_CLIENT,
            connection: {
                host: Environment.DB_HOST,
                user: Environment.DB_USER,
                password: Environment.DB_PASSWORD,
                database: Environment.DB_TEST_NAME,
                port: Environment.DB_PORT
            }
        });

        address = `${app.conf.baseUrl}/${app.conf.prefix}`;
        axios = Axios.create({ baseURL: address });
        console.log(`x+x+x+x+x+x+x+x+x+x+x+x+ Address: ${address} x+x+x+x+x+x+x+x+x+x+x+x+x+x+x`);
    });

    after(async () => {

        if (knex) {
            await KnexCleaner.clean(knex);
        }

        app.close();
    });

    it('POST /account/register', async () => {

        const resRegister = await axios.post('/account/register', testAccount);

        expect(resRegister.data).to.be.object();
        expect(resRegister.data.username).to.be.not.null();
    });

    it('POST /auth/login', async () => {

        const resLogin = await axios.post('/auth/login', testAccount);

        expect(resLogin.data).to.be.object();
        expect(resLogin.headers).to.be.object();
        expect(resLogin.headers.authorization).to.be.string().and.to.contains('Bearer');

        /* eslint-disable dot-notation */
        headerToken.authorization = resLogin.headers.authorization;
    });

    it('GET /account', async () => {

        const resAccount = await axios.get('/account', { headers: headerToken });

        expect(resAccount.data).to.be.object();
        expect(resAccount.data.username).to.be.a.string();
        expect(resAccount.id).to.be.not.null();

        account = resAccount.data;
    });

    it('GET /account/:accountId', async () => {

        const resAccount = await axios.get(`/account/${account.id}`, { headers: headerToken });

        expect(resAccount.data).to.be.object();
        expect(resAccount.data.username).to.be.a.string();
        expect(resAccount.id).to.be.not.null();
    });
});
