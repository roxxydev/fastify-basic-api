'use strict';

const FastifyPlugin = require('fastify-plugin');
const Fs = require('fs');
const Path = require('path');
const Knex = require('knex');
const Mongoose = require('mongoose');

const store = {};


const knexInit = async (fastify, options) => {

    const knex = Knex({
        client: options.client,
        connection: options.connection
    });

    const migrationConfig = {
        directory: Path.resolve(`${__dirname}/../migrations`),
        loadExtensions: ['.js']
    };

    await knex.migrate.latest(migrationConfig);

    fastify.addHook('onClose', (app) => {

        if (app.store && app.store.mapperInstance) {
            app.store.mapperInstance.destroy(() => {

                app.log.info('Knex pool destroyed.');
            });
        }
    });

    knex.utils = fastify.utils;

    return knex;
};

const mongooseInit = async (fastify, options) => {

    const { host, port, username, password, database } = options.connection;
    const connString = `mongodb://${username}:${password}@${host}:${port}/${database}`;

    const dbConnection = await Mongoose.connect(
        connString,
        {
            useNewUrlParser: true,
            keepAlive: true,
            keepAliveInitialDelay: 300000
        });

    const directory = Path.resolve(`${__dirname}/../schemas`);
    const mongooseObj = {
        connection: dbConnection,
        models: {}
    };

    for (const file of files) {
        const modelPath = Path.resolve(directory, file);
        const Model = require(modelPath);
        mongooseObj.models[Model.instance.constructor.modelName] = Model;
    }

    fastify.addHook('onClose', (app) => {

        if (app.store && app.store.mapperInstance && app.store.mapperInstance.dbConnection) {
            app.store.mapperInstance.dbConnection.close(() => {

                app.log.info('Mongoose connection is disconnected through app termination.');
            });
        }
    });

    mongooseObj.utils = fastify.utils;

    return mongooseObj;
};


/**
 * Run store operation in a transaction.
 * @param {function} task - The function taking parameter transaction object and is containing related
 *                          operations to be put in a transaction.
 */
const runInTransaction = async (task) => {

    if (store.mapper === 'knex') {

        return store.mapperInstance.transaction(async (trx) => {

            const data = await task(trx);

            return data;
        });
    }
    else if (store.mapper === 'mongoose') {

        const session =  await store.mapperInstance.connection.startSession();

        return session.withTransaction(async () => {

            const opts = { session };
            const data = await task(opts);

            return data;
        });
    }
};

const init = async (fastify, options = {}, done) => {

    store.mapper = options.mapper || 'knex';
    const dir = options.dir || Path.resolve(`${__dirname}/../models/operations`);
    const operationsPath = Path.resolve(dir, store.mapper);

    if (store.mapper === 'knex') {
        const { client, connection } = options;
        const knex = await knexInit(fastify, { client, connection });
        store.mapperInstance = knex;
    }
    else if (store.mapper === 'mongoose') {
        const { connection } = options;
        const mongoose = await mongooseInit(fastify, connection);
        store.mapperInstance = mongoose;
    }

    const files = Fs.readdirSync(operationsPath);

    for (const file of files) {
        const modelName = Path.parse(file).name;
        const modelOpsModulePath = Path.resolve(operationsPath, file);

        const Ops = require(modelOpsModulePath);
        const model = new Ops(store.mapperInstance);

        store[modelName] = model;
    }

    store.runInTransaction = runInTransaction;

    fastify.decorate('store', store);
    fastify.log.info('Initialized store...');

    done();
};

module.exports = FastifyPlugin(init);

