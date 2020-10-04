'use strict';

const Models = require('../models');
const { name } = Models.profile;

const up = async (knex) => {

        return knex.schema.table(name, (table) => {

            table.string('facebook_id');
            table.string('linkedin_id');
            table.string('twitter_id');
        });
};

const down = (knex) => {};

const config = {
    transaction: true
}

module.exports = {
    up,
    down,
    config
};
