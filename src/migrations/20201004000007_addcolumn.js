'use strict';

const Models = require('../models/model');

const { name } = Models.profile;


const up = async (knex) => {

    const exists = await knex.schema.hasTable(name);

    if (exists) {

        return await knex.schema.table(name, (table) => {

            if (!knex.schema.hasColumn(name, 'facebook_id')) {

                table.string('facebook_id');
            }

            if (!knex.schema.hasColumn(name, 'linkedin_id')) {

                table.string('linkedin_id');
            }

            if (!knex.schema.hasColumn(name, 'twitter_id')) {

                table.string('twitter_id');
            }
        });
    }
};

const down = (knex) => {};

const config = {
    transaction: true
};

module.exports = {
    up,
    down,
    config
};
