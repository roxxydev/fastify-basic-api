'use strict';

const Models = require('../../model');

const { name, props } = Models.accountRole;


class AccountRoleOps {

    constructor(knex) {

        this.knex = knex;
    }

    async create(payload) {

        const returningProps = ['id', 'created_at'];

        const data = await this.knex(name).insert(payload, returningProps);
        const [accountRole] = data;

        return accountRole;
    }

    async get(id) {

        const returningProps = ['id', props.roleId, props.accountId, 'created_at'];
        const data = await this.knex(name).select(returningProps).from(name).where({ id });

        if (data.length > 1) {

            return null;
        }

        const [accountRole] = data;

        return accountRole;
    }

    async list(filter) {

        const returningProps = ['id', props.roleId, props.accountId, 'created_at'];
        let accountRoles = [];

        if (filter) {

            accountRoles = await this.knex(name).select(returningProps).from(name).where(filter);
        }
        else {
            accountRoles = await this.knex(name).select(returningProps).from(name);
        }

        return accountRoles;
    }

    async update() {

    }

    async remove() {

    }
}

module.exports = AccountRoleOps;
