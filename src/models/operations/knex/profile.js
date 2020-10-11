'use strict';

const Models = require('../../model');

const { name, props } = Models.profile;


class ProfileOps {

    constructor(knex) {

        this.knex = knex;
    }

    async create(payload, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const data = await knex(name).insert(payload, '*');
        delete data.created_at;
        const [profile] = data;

        return profile;
    }

    async get(id, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const data = await knex(name).select('*').from(name).where({ id });

        if (data.length > 1) {

            return null;
        }

        const [profile] = data;

        return profile;
    }

    async list(filter, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const returningProps = ['id', props.username, 'created_at'];
        let accounts = [];

        if (filter) {

            accounts = await knex(name).select(returningProps).from(name).where(filter);
        }
        else {
            accounts = await knex(name).select(returningProps).from(name);
        }

        return accounts;
    }

    async update(args, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const { id, payload } = args;

        const data = await knex(name)
            .update(payload)
            .where({ id });

        return data;
    }

    async remove(id, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const rowsDeleted = await knex(name).where({ id }).delete();
        const isDeleted = rowsDeleted > 0;

        return isDeleted;
    }
}

module.exports = ProfileOps;
