'use strict';

const Models = require('../models/model');

const { name, props } = Models.account;


const up = async (knex) => {

    const exists = await knex.schema.hasTable(name);

    if (!exists) {

        return knex.schema.createTable(name, (table) => {

            table.increments('id');
            table.string(props.username).notNullable();
            table.string(props.password).notNullable();
            table.boolean(props.active).defaultTo(true).notNullable();
            table.timestamps(true, true);
        });
    }
};

const down = (knex) => {

    return knex.schema.dropTable(name);
};

const config = {
    transaction: true
};

module.exports = {
    up,
    down,
    config
};
