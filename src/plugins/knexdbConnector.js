'use strict';

const FastifyPlugin = require('fastify-plugin');
const Knex = require('knex');
const Path = require('path');

const knexConnector = async (fastify, options = {}, done) => {

    const db = Knex({
        client: options.client,
        connection: options.connection
    });

    const migrationConfig = {
        directory: Path.resolve(`${__dirname}/../migrations`),
        loadExtensions: ['.js']
    };

    await db.migrate.latest(migrationConfig);

    fastify.decorate('knex', db);

    fastify.addHook('onClose', (app) => {

        const { knex } = app;
        knex.destroy(() => {

            app.log.info('Knex pool destroyed.');
        });
    });

    done();
};

module.exports = FastifyPlugin(knexConnector);
