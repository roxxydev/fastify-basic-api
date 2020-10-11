'use strict';

const Model = require('../../models/model');
const { AccountService } = require('./accountService');

const { props } = Model.profile;


class ProfileService {

    constructor(app) {

        if (!app.ready) {

            throw new Error(`can't get .ready from fastify app.`);
        }

        this.app = app;

        if (!app.store) {

            throw new Error('cant get .store from fastify app.');
        }

        this.store = app.store;
    }

    async create({ accountId, payload }) {

        if (payload.accountId !== accountId) {

            throw this.app.httpErrors.unauthorized();
        }

        const existingProfile = await this.store.profile.list({ [props.accountId]: accountId });

        if (existingProfile) {

            throw this.app.httpErrors.notFound(`profile not found.`);
        }

        if (!payload) {

            throw this.app.httpErrors.badRequest('missing payload');
        }

        const accountService = new AccountService(this.app);
        const account = await accountService.get({ id: payload.accountId });

        payload[props.accountId] = account.id;
        delete payload.accountId;

        const profile = await this.store.profile.create(payload);

        return profile;
    }

    async get(args) {

        const { id } = args;

        if (!id) {

            throw this.app.httpErrors.badRequest('id missing.');
        }

        const profile = await this.store.profile.get(id);

        if (!profile) {

            throw this.app.httpErrors.notFound(`profile not found.`);
        }

        return profile;
    }

    async getAll(filter) {

        return await this.store.profile.list(filter);
    }

    async update(args) {

        const { id, payload = {} } = args;

        const profileBefore = await this.get({ id });

        if (!profileBefore) {

            throw this.app.httpErrors.notFound(`profile not found.`);
        }

        const profileAfter = await this.store.profile.update({ id: profileBefore.id, payload });

        return profileAfter;
    }

    async delete(id) {

        const profileBefore = await this.get({ id });

        if (!profileBefore) {

            throw this.app.httpErrors.notFound(`profile not found.`);
        }

        const isDeleted = await this.store.profile.remove(profileBefore.id);

        return isDeleted;
    }
}

module.exports = {
    ProfileService
};
