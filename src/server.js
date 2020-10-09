/* eslint no-console: 0 */
'use strict';

const Fastify = require('fastify');
const FastifySensible = require('fastify-sensible');
const FastifyJwt = require('fastify-jwt');
const KnexConnector = require('./plugins/knexdbConnector');
const Store = require('./plugins/store');
const Routes = require('./routes/api');
const Setup = require('./setup');
const Utils = require('./utils');
const Path = require('path');


module.exports = async (environment) => {

    // level: trace - log all, error - log only ERROR
    const logger = {
        level: 'trace',
        prettyPrint: true,
        redact: ['req.headers.authorization'],
        serializers: {
            res(reply) {

                return {
                    statusCode: reply.statusCode
                };
            },
            req(request) {

                return {
                    method: request.method,
                    url: request.url,
                    path: request.path,
                    parameters: request.parameters,
                    headers: request.headers
                };
            }
        }
    };

    const fastify = Fastify({
        logger,
        ignoreTrailingSlash: true,
        maxParamLength: 200
    });

    const utilities = {};
    for (const method of Utils) {
        Object.assign(utilities, method);
    }

    fastify.log.info(`Setting up objects...`);
    await fastify.decorate('conf', environment);
    await fastify.decorate('utils', utilities);

    fastify.log.info(`Setting up logger...`);
    await fastify.register(FastifySensible);

    await fastify.addHook('onSend', (request, reply, payload) => {

        if (payload) {
            fastify.log.debug({ body: payload }, `response payload reqId: ${ request.id }`);
        }
    });

    await fastify.addHook('preValidation', (request, reply) => {

        if (request && request.body) {
            fastify.log.debug({ body: request.body }, `request payload reqId: ${ request.id }`);
        }
    });

    fastify.log.info(`Setting up query builder...`);
    const config = fastify.conf;
    await fastify.register(KnexConnector, {
        client: config.DB_SQL_CLIENT,
        connection: {
            host: config.DB_SQL_HOST,
            user: config.DB_SQL_USER,
            password: config.DB_SQL_PASSWORD,
            database: config.DB_SQL_NAME,
            port: config.DB_SQL_PORT
        }
    });

    fastify.log.info(`Setting up store...`);
    await fastify.register(Store, {
        mapper: 'knex',
        dir: Path.resolve(`${__dirname}/models/operations`)
    });

    fastify.log.info(`Setting roles and priveleges...`);
    await Setup.run(fastify);

    fastify.log.info(`Setting up authentication...`);
    await fastify.register(FastifyJwt, {
        secret: config.TOKEN_SECRET,
        sign: {
            issuer: config.TOKEN_ISSUER,
            expiresIn: config.TOKEN_EXPIRES
        },
        messages: {
            badRequestErrorMessage: 'Invalid authorization header format',
            noAuthorizationInHeaderMessage: 'Autorization header missing',
            authorizationTokenExpiredMessage: 'Authorization token expired',
            authorizationTokenInvalid: (err) => {

                return `Authorization token invalid. ${err}`;
            }
        }
    });

    fastify.log.info(`Setting up routes...`);
    await fastify.ready(() => {

        fastify.log.info(`Added routes:\n${ fastify.printRoutes() }`);
    });

    await fastify.register(Routes, {
        prefix: `${ config.API_PREFIX }/${ config.API_VERSION }`
    });

    try {
        await fastify.listen(config.APP_PORT, config.APP_HOST);
        fastify.log.info(fastify.initialConfig, 'Intiialized server with config: ');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }

    return fastify;
};
