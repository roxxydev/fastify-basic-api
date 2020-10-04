'use strict';

const Model = require('../../schema/models');
const { AccountService } = require('../services/account');
const { ['name']: modelName } = Model.profile;


class ProfileService {

    /**
     * Creates an instance of ProfileService.
     * @param {object} app fastify app
     * @memberof ProfileService
     */
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

    /**
     * function to create one
     *
     * @param { {payload: object} } { payload }
     * @returns {Promise<number>} created id
     * @memberof ProfileService
     */
    async create ({ payload }) {

        if (!payload) {

            throw this.app.httpErrors.badRequest('missing payload');
        }

        const accountService = new AccountService(this.app);
        await accountService.get({ id: payload.accountId });
        delete payload.accountId;

        const data = await this.knex(modelName).insert(payload, '*');
        delete data.created_at;
        const [profile] = data;

        return profile;
    }

    /**
     * function to get all
     *
     * @param { filter: object } { filter = {} }
     * @returns {Promise<{ id: number }>[]} array
     * @memberof ProfileService
     */
    async getAll ({ filter = {} }) {

        const profiles = await this.knex.select('*').from(modelName).where(filter);

        return profiles;
    }

    /**
     * function to get
     *
     * @param { { id: number } } { id }
     * @returns {Promise<{id: number}>} object
     * @memberof ProfileService
     */
    async get ({ id }) {

        if (!id) {

            throw this.app.httpErrors.badRequest('id missing.');
        }

        const data = await this.knex.select('*').from(modelName).where({ id });

        if (!data.length) {

            throw this.app.httpErrors.notFound(`profile ${id} not found.`);
        }

        const [profile] = data;

        return profile;
    }

    /**
     * function to update one
     *
     * @param { { id: number, profile: object } } { id, profile = {} }
     * @returns {Promise<{ id: number }>} updated
     * @memberof ProfileService
     */
    async update ({ id, profile = {} }) {

        const profileBefore = await this.get({ id });

        await this.knex(modelName)
            .update(profile)
            .where({ id: profileBefore.id });

        const profileAfter = await this.get({ id });

        return profileAfter;
    }

    /**
     * function to delete one
     *
     * @param { { id: number } } { id }
     * @returns {Promise<object>} deleted
     * @memberof ProfileService
     */
    async delete ({ id }) {

        const profileBefore = await this.get({ id });

        await this.knex(modelName).where({ id }).delete();
        delete profileBefore.id;

        return profileBefore;
    }
}

module.exports = {
    ProfileService
};
