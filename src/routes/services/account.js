'use strict';

const Model = require('../../schema/models');
const { ['name']: modelName, props } = Model.account;


class AccountService {

    constructor (app) {

        if (!app.ready) {

            throw new Error(`can't get .ready from fastify app.`);
        }
        this.app = app;

        if (!app.knex) {
            throw new Error('cant get .knex from fastify app.');
        }
        this.knex = app.knex;
    }

    async create ({ payload }) {

        if (!payload) {

            throw this.app.httpErrors.badRequest(`account ${id} not found.`);
        }

        const existingAccts = await this.get({ [props.username]: payload.username });
        if (existingAccts.length) {

            throw this.app.httpErrors.conflict(`username ${payload.username} already exists.`);
        }

        if (payload[props.password]) {
            payload[props.password] = await this.app.utils.encryptPswd(payload[props.password]);
        }

        const returningProps = ['id', props.username, 'created_at'];
        const data = await this.knex(modelName).insert(payload, returningProps);
        const [account] = data;

        delete account[props.password];
        delete account.updated_at;

        return account;
    }

    async get (args) {

        const { id, username } = args;
        const returningProps = ['id', props.username, 'created_at'];

        if (username) {
            const accounts = await this.knex.select(returningProps).from(modelName).where({
                [props.username]: username
            });

            return accounts;
        }

        const data = await this.knex.select(returningProps).from(modelName).where({ id });

        if (!data.length) {

            throw this.app.httpErrors.notFound(`account ${id} not found.`);
        }

        const [account] = data;

        return account;
    }
}

module.exports = {
    AccountService
};
