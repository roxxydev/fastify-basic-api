/* eslint no-console: 0 */
'use strict';

const Fastify = require('fastify');
const FastifySensible = require('fastify-sensible');
const FastifyJwt = require('fastify-jwt');
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

    fastify.log.info(`Setting up config...`);

    await fastify.decorate('conf', environment);
    await fastify.decorate('utils', utilities);

    fastify.log.info(`Setting up logger...`);
    await fastify.register(FastifySensible);

    await fastify.addHook('onSend', (request, reply, payload, done) => {

        if (payload) {
            fastify.log.debug({ body: payload }, `response payload reqId: ${ request.id }`);
        }

        done();
    });

    await fastify.addHook('preValidation', (request, reply, done) => {

        if (request && request.body) {
            fastify.log.debug({ body: request.body }, `request payload reqId: ${ request.id }`);
        }

        done();
    });

    fastify.log.info(`Setting up store...`);
    const config = fastify.conf;
    await fastify.register(Store, {
        mapper: 'knex',
        dir: Path.resolve(`${__dirname}/models/operations`),
        client: config.DB_CLIENT,
        connection: {
            host: config.DB_HOST,
            port: config.DB_PORT,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_NAME
        }
    });

    fastify.log.info(`Setting roles and privileges...`);
    await Setup.run(fastify);

    fastify.log.info(`Setting up authentication...`);
    await fastify.register(FastifyJwt, {
        secret: config.TOKEN_SECRET,
        sign: {
            issuer: config.TOKEN_ISSUER,
            expiresIn: config.TOKEN_EXPIRES
        },
        verify: {
            issuer: config.TOKEN_ISSUER
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

    const prefix = `${ config.API_PREFIX }/${ config.API_VERSION }`;
    await fastify.register(Routes, { prefix });

    try {
        const address = await fastify.listen(config.APP_PORT, config.APP_HOST);
        fastify.conf.baseUrl = address;
        fastify.conf.prefix = prefix;
        fastify.log.info(fastify.initialConfig, 'Intiialized server with config: ');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }

    return fastify;
};
