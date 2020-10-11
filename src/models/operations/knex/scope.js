'use strict';

const Models = require('../../model');

const { name, props } = Models.scope;


class ScopeOps {

    constructor(knex) {

        this.knex = knex;
    }

    async create(payload, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const returningProps = ['id', 'created_at'];

        const data = await knex(name).insert(payload, returningProps);
        const [scope] = data;

        return scope;
    }

    async get(args, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const { id, name: scopeName } = args;
        const returningProps = ['id', props.name, props.description, 'created_at'];
        let data;

        if (id) {
            data = await knex(name).select(returningProps).from(name).where({ id });
        }

        if (scopeName) {
            data = await knex(name).select(returningProps).from(name).where({ [props.name]: scopeName });
        }

        if (data.length > 1) {

            return null;
        }

        const [scope] = data;

        return scope;
    }

    async list(filter, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const returningProps = ['id', props.name, props.description, 'created_at'];
        let scopes = [];

        if (filter) {

            scopes = await knex(name).select(returningProps).from(name).where(filter);
        }
        else {
            scopes = await knex(name).select(returningProps).from(name);
        }

        return scopes;
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

module.exports = ScopeOps;
