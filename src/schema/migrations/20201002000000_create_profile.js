'use strict';

const Models = require('../models');
const { name, props } = Models.profile;

const up = async (knex) => {

    const exists = await knex.schema.hasTable(name);

    if (!exists) {

        return knex.schema.createTable(name, (table) => {

            table.increments('id');
            table.string(props.firstName).notNullable();
            table.string(props.lastName).notNullable();
            table.string(props.middleName);
            table.string(props.gender).notNullable();
            table.date(props.birthday).notNullable();
            table.timestamps(true, true);

            table.integer('account_id').references('id').inTable(name);
        });
    }
};

const down = (knex) => {

    return knex.schema.dropTable(name)
};

const config = {
    transaction: true
}

module.exports = {
    up,
    down,
    config
};
