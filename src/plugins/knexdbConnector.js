'use strict';

const FastifyPlugin = require('fastify-plugin');
const Knex = require('knex');
const Path = require('path');

const knexConnector = async (server, options = {}) => {

    const db = Knex({
        client: options.client,
        connection: options.connection
    });

    const migrationConfig = {
        directory: Path.resolve(`${__dirname}/../schema/migrations`),
        loadExtensions: ['.js']
    };

    db.migrate.latest(migrationConfig);

    server.decorate('knex', db);
};

module.exports = FastifyPlugin(knexConnector);
