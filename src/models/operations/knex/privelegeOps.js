'use strict';

const Models = require('../../model');

const { name, props } = Models.privelege;


class PrivelegeOps {

    constructor(knex) {

        this.knex = knex;
    }

    async create(payload) {

        const returningProps = ['id', 'created_at'];

        const data = await this.knex(name).insert(payload, returningProps);
        const [scope] = data;

        return scope;
    }

    async get(id) {

        const data = await this.knex(name).select('*').from(name).where({ id });

        if (data.length > 1){

            return null;
        }

        const [privelege] = data;

        return privelege;
    }

    async list(filter) {

        const returningProps = ['id', props.roleId, props.scopeId, 'created_at'];
        let priveleges = [];

        if (filter) {

            priveleges = await this.knex(name).select(returningProps).from(name).where(filter);
        }
        else {
            priveleges = await this.knex(name).select(returningProps).from(name);
        }

        return priveleges;
    }

    async update() {

    }

    async remove() {

    }
}

module.exports = PrivelegeOps;
