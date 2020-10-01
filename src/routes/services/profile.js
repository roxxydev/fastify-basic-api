'use strict';

const Model = require('../../schema/models');
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

        const { knex } = this.app;

        if (!knex) {
            throw new Error('cant get .knex from fastify app.');
        }
    }

    /**
     * function to create one
     *
     * @param { {profile: object} } { profile }
     * @returns {Promise<number>} created id
     * @memberof ProfileService
     */
    async create ({ profile }) {

        const err = new Error();
        if (!profile) {
            err.statusCode = 400;
            err.message = 'profile is needed.';

            throw err;
        }

        const { knex } = this.app;
        const id = (await knex(modelName).insert(profile))[0];
        const createdProfile = await this.getOne({ id });

        return createdProfile;
    }

    /**
     * function to get all
     *
     * @param { filter: object } { filter = {} }
     * @returns {Promise<{ id: number }>[]} array
     * @memberof ProfileService
     */
    async getAll ({ filter = {} }) {

        const { knex } = this.app;
        const profiles = await knex.select('*').from(modelName).where(filter);

        return profiles;
    }

    /**
     * function to get one
     *
     * @param { { id: number } } { id }
     * @returns {Promise<{id: number}>} object
     * @memberof ProfileService
     */
    async getOne ({ id }) {

        const err = new Error();

        if (!id) {
            err.message = 'id is needed';
            err.statusCode = 400;

            throw err;
        }

        const { knex } = this.app;
        const data = await knex.select('*').from(modelName).where({ id });

        if (!data.length) {
            err.statusCode = 412;
            err.message = `can't get the profile ${id}.`;

            throw err;
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

        const profileBefore = await this.getOne({ id });

        if (isEmptyObject(profile)) {
            return profileBefore;
        }

        const { knex } = this.app;
        await knex(modelName)
            .update(profile)
            .where({ id: profileBefore.id });

        const profileAfter = await this.getOne({ id });

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

        const profileBefore = await this.getOne({ id });

        const { knex } = this.app;
        await knex(modelName).where({ id }).delete();

        delete profileBefore.id;

        return profileBefore;
    }
}

module.exports = {
    ProfileService
};
