'use strict';

const Models = require('../../model');

const { name, props } = Models.scope;


class ScopeOps {

    constructor(knex) {

        this.knex = knex;
    }

    async create(payload) {

        const returningProps = ['id', 'created_at'];

        const data = await this.knex(name).insert(payload, returningProps);
        const [scope] = data;

        return scope;
    }

    async get(args) {

        const { id, name: scopeName } = args;
        const returningProps = ['id', props.name, props.description, 'created_at'];
        let data;

        if (id) {
            data = await this.knex(name).select(returningProps).from(name).where({ id });
        }

        if (scopeName) {
            data = await this.knex(name).select(returningProps).from(name).where({ [props.name]: scopeName });
        }

        if (data.length > 1) {

            return null;
        }

        const [scope] = data;

        return scope;
    }

    async list(filter) {

        const returningProps = ['id', props.name, props.description, 'created_at'];
        let scopes = [];

        if (filter) {

            scopes = await this.knex(name).select(returningProps).from(name).where(filter);
        }
        else {
            scopes = await this.knex(name).select(returningProps).from(name);
        }

        return scopes;
    }

    async update() {

    }

    async remove() {

    }
}

module.exports = ScopeOps;
