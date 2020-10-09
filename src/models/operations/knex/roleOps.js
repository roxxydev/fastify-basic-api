'use strict';

const Models = require('../../model');

const { name, props } = Models.role;


class RoleOps {

    constructor(knex) {

        this.knex = knex;
    }

    async create(payload) {

        const returningProps = ['id', 'created_at'];

        const data = await this.knex(name).insert(payload, returningProps);
        const [role] = data;

        return role;
    }

    async get(args) {

        const { id, name: roleName } = args;
        const returningProps = ['id', props.name, props.description, 'created_at'];
        let data;

        if (id) {
            data = await this.knex(name).select(returningProps).from(name).where({ id });
        }

        if (roleName) {
            data = await this.knex(name).select(returningProps).from(name).where({ name: roleName });
        }

        if (data.length > 1) {

            return null;
        }

        const [role] = data;

        return role;
    }

    async list(filter) {

        const returningProps = ['id', props.name, props.description, 'created_at'];
        let roles = [];

        if (filter) {

            roles = await this.knex(name).select(returningProps).from(name).where(filter);
        }
        else {
            roles = await this.knex(name).select(returningProps).from(name);
        }

        return roles;
    }

    async update() {

    }

    async remove() {

    }
}

module.exports = RoleOps;
