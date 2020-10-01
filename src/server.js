/* eslint no-console: 0 */
'use strict';

const Fastify = require('fastify');
const KnexConnector = require('./plugins/knexdbConnector');
const Routes = require('./routes/api');


const {
    APP_HOST,
    APP_PORT
} = require('./environment');

module.exports = async () => {

    const fastify = Fastify({
        logger: {
            level: 'trace',
            prettyPrint: true
        },
        ignoreTrailingSlash: true,
        maxParamLength: 200
    });

    await fastify.register(KnexConnector, {});
    await fastify.register(Routes, { prefix: 'api' });

    await fastify.get('/', async () => {

        return {};
    });

    const start = async () => {

        try {

            const address = await fastify.listen(APP_PORT, APP_HOST);
            fastify.log.info(`intiialized server with config: ${ fastify.initialConfig }`);
            fastify.log.info(`server listening on ${ address }`);
        } catch (err) {

            fastify.log.error(err);
            process.exit(1);
        }
    };

    start();
};
