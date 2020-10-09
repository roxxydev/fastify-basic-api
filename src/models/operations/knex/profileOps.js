'use strict';

const Models = require('../../model');

const { name, props } = Models.profile;


class ProfileOps {

    constructor(knex) {

        this.knex = knex;
    }

    async create(payload) {

        const data = await this.knex(name).insert(payload, '*');
        delete data.created_at;
        const [profile] = data;

        return profile;
    }

    async get(id) {

        const data = await this.knex(name).select('*').from(name).where({ id });

        if (data.length > 1) {

            return null;
        }

        const [profile] = data;

        return profile;
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

    async update(id, payload) {

        const updatedProfile = await this.knex(name)
            .update(payload)
            .where({ id });

        return updatedProfile;
    }

    async remove(id) {

        const rowsDeleted = await this.knex(name).where({ id }).delete();
        const isDeleted = rowsDeleted > 0;

        return isDeleted;
    }
}

module.exports = ProfileOps;
