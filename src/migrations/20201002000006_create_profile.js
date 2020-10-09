'use strict';

const Models = require('../models/model');

const { name, props } = Models.profile;
const account = Models.account;


const up = async (knex) => {

    const exists = await knex.schema.hasTable(name);

    if (!exists) {

        const accountModelName = account.name;

        return knex.schema.createTable(name, (table) => {

            table.increments('id');
            table.string(props.firstName).notNullable();
            table.string(props.lastName).notNullable();
            table.string(props.middleName);
            table.string(props.gender).notNullable();
            table.date(props.birthday).notNullable();
            table.timestamps(true, true);

            table.integer('account_id')
                .notNullable()
                .references('id')
                .inTable(accountModelName);

            table.unique(['id', 'account_id']);
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
