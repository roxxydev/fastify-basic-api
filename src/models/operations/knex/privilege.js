'use strict';

const Models = require('../../model');

const { name, props } = Models.privilege;


class PrivilegeOps {

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

    async get(id, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const data = await knex(name).select('*').from(name).where({ id });

        if (data.length > 1) {

            return null;
        }

        const [privilege] = data;

        return privilege;
    }

    async list(filter, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const returningProps = ['id', props.roleId, props.scopeId, 'created_at'];
        let privileges = [];

        if (filter) {

            privileges = await knex(name).select(returningProps).from(name).where(filter);
        }
        else {
            privileges = await knex(name).select(returningProps).from(name);
        }

        return privileges;
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

module.exports = PrivilegeOps;
