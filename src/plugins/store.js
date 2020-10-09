'use strict';

const FastifyPlugin = require('fastify-plugin');
const Fs = require('fs');
const Path = require('path');

const store = {};

const addModelCrud = (fastify, mapper, modelName, modelOperationsPath) => {

    const Ops = require(modelOperationsPath);

    const model = new Ops(fastify[mapper]);
    store[modelName] = model;

    const ops = Object.getOwnPropertyNames(Object.getPrototypeOf(model));
    ops.shift();

    // ops.forEach((prop) => {

    //     const method = { [prop]: model[prop] };
    //     Object.assign(store[modelName], method);
    // });
};

const init = (fastify, options = {}, done) => {

    options = options || {};
    const mapper = options.mapper || 'knex';
    const dir = options.dir || Path.resolve(`${__dirname}/../models/operations`);
    const operationsPath = Path.resolve(dir, mapper);

    Fs.readdir(operationsPath, (err, files) => {

        if (err) {

            throw new Error(`Error initializing store plugin. ${err.message}`);
        }

        files.forEach((file) => {

            let modelName = Path.parse(file).name;
            modelName = modelName.substring(0, modelName.length - 3);
            const modelOperationsPath = Path.resolve(operationsPath, file);
            addModelCrud(fastify, mapper, modelName, modelOperationsPath);
        });

        fastify.log.info('Initialized store.');
        fastify.decorate('store', store);

        done();
    });
};

module.exports = FastifyPlugin(init);
