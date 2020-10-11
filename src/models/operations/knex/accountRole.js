'use strict';

const Models = require('../../model');

const { name, props } = Models.accountRole;


class AccountRoleOps {

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
        const [accountRole] = data;

        return accountRole;
    }

    async get(id, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const returningProps = ['id', props.roleId, props.accountId, 'created_at'];
        const data = await knex(name).select(returningProps).from(name).where({ id });

        if (data.length > 1) {

            return null;
        }

        const [accountRole] = data;

        return accountRole;
    }

    async list(filter, trx) {

        let knex = this.knex;
        if (trx) {
            knex = trx;
        }

        const returningProps = ['id', props.roleId, props.accountId, 'created_at'];
        let accountRoles = [];

        if (filter) {

            accountRoles = await knex(name).select(returningProps).from(name).where(filter);
        }
        else {
            accountRoles = await knex(name).select(returningProps).from(name);
        }

        return accountRoles;
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

module.exports = AccountRoleOps;
