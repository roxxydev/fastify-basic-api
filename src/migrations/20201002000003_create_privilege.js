'use strict';

const Models = require('../models/model');

const { name, props } = Models.privilege;
const { name: roleName } = Models.role;
const { name: scopeName } = Models.scope;


const up = async (knex) => {

    const exists = await knex.schema.hasTable(name);

    if (!exists) {

        return knex.schema.createTable(name, (table) => {

            table.increments('id');
            table.bigInteger(props.roleId).notNullable();
            table.bigInteger(props.scopeId).notNullable();
            table.timestamps(true, true);

            table.unique([props.roleId, props.scopeId]);

            table.foreign(props.roleId)
                .references('id')
                .inTable(roleName);

            table.foreign(props.scopeId)
                .references('id')
                .inTable(scopeName);
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
