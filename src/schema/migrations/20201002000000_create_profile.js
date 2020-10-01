'use strict';

const Models = require('../models');
const { name, props } = Models.profile;

const up = async (knex) => {

    const exists = await knex.schema.hasTable(name);

    if (!exists) {

        return knex.schema.createTable(name, (table) => {

            table.increments('id');
            table.string(props.firstName, 100).notNullable();
            table.string(props.lastName, 100).notNullable();
            table.string(props.middleName, 100);
            table.string(props.gender, 6).notNullable();
            table.date(props.birthday).notNullable();
            table.timestamps(true, true);
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
