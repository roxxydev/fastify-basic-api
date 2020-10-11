'use strict';

const Models = require('../../model');

const { name, props } = Models.role;


class RoleOps {

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
        const [role] = data;

        return role;
    }

    async get(args, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const { id, name: roleName } = args;
        const returningProps = ['id', props.name, props.description, 'created_at'];
        let data;

        if (id) {
            data = await knex(name).select(returningProps).from(name).where({ id });
        }

        if (roleName) {
            data = await knex(name).select(returningProps).from(name).where({ name: roleName });
        }

        if (data.length > 1) {

            return null;
        }

        const [role] = data;

        return role;
    }

    async list(filter, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const returningProps = ['id', props.name, props.description, 'created_at'];
        let roles = [];

        if (filter) {

            roles = await knex(name).select(returningProps).from(name).where(filter);
        }
        else {
            roles = await knex(name).select(returningProps).from(name);
        }

        return roles;
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

module.exports = RoleOps;
