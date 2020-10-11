'use strict';

const Models = require('../../model');

const { name, props } = Models.account;


class AccountOps {

    constructor(knex) {

        this.knex = knex;
    }

    async create(payload, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const returningProps = ['id', props.username, 'created_at'];

        const data = await knex(name).insert(payload, returningProps);
        const [account] = data;

        delete account[props.password];
        delete account.updated_at;

        return account;
    }

    async get(args, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const { id, username } = args;
        const returningProps = ['id', props.username, 'created_at'];
        let data;

        if (id) {
            data = await knex(name).select(returningProps).from(name).where({ id });
        }

        if (username) {
            data = await knex(name).select(returningProps).from(name).where({ username });
        }

        if (data.length > 1) {

            return null;
        }

        const [account] = data;

        return account;
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

module.exports = AccountOps;
