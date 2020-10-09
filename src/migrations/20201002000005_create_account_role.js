'use strict';

const Models = require('../models/model');

const { name, props } = Models.accountRole;
const { name: roleName } = Models.role;
const { name: accountName } = Models.account;


const up = async (knex) => {

    const exists = await knex.schema.hasTable(name);

    if (!exists) {

        return knex.schema.createTable(name, (table) => {

            table.increments('id');
            table.bigInteger(props.roleId).notNullable();
            table.bigInteger(props.accountId).notNullable();
            table.boolean(props.active).defaultTo(true).notNullable();
            table.timestamps(true, true);

            table.unique([props.accountId, props.roleId]);

            table.foreign(props.accountId)
                .references('id')
                .inTable(accountName);

            table.foreign(props.roleId)
                .references('id')
                .inTable(roleName);
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
