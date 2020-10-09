'use strict';

const Models = require('../../model');

const { name, props } = Models.account;


class AccountOps {

    constructor(knex) {

        this.knex = knex;
    }

    async create(payload) {

        const returningProps = ['id', props.username, 'created_at'];

        const data = await this.knex(name).insert(payload, returningProps);
        const [account] = data;

        delete account[props.password];
        delete account.updated_at;

        return account;
    }

    async get(args) {

        const { id, username } = args;
        const returningProps = ['id', props.username, 'created_at'];
        let data;

        if (id) {
            data = await this.knex(name).select(returningProps).from(name).where({ id });
        }

        if (username) {
            data = await this.knex(name).select(returningProps).from(name).where({ username });
        }

        if (data.length > 1) {

            return null;
        }

        const [account] = data;

        return account;
    }

    async list(filter) {

        const returningProps = ['id', props.username, 'created_at'];
        let accounts = [];

        if (filter) {

            accounts = await this.knex(name).select(returningProps).from(name).where(filter);
        }
        else {
            accounts = await this.knex(name).select(returningProps).from(name);
        }

        return accounts;
    }

    async update() {

    }

    async remove() {

    }
}

module.exports = AccountOps;
