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

        if (!payload) {

            throw this.app.httpErrors.badRequest('missing payload');
        }

        const accountService = new AccountService(this.app);
        const account = await accountService.get({ id: payload.accountId });

        if (!account) {

            throw this.app.httpErrors.badRequest(`account ${accountId} not found.`);
        }

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

            throw this.app.httpErrors.notFound(`profile ${id} not found.`);
        }

        return profile;
    }

    async getAll(filter) {

        return await this.store.profile.list(filter);
    }

    async update(args) {

        const { id, payload = {} } = args;

        const profileBefore = await this.get({ id });
        const profileAfter = await this.store.profile.update(profileBefore.id, payload);

        return profileAfter;
    }

    async delete(id) {

        const profileBefore = await this.get({ id });
        const isDeleted = await this.store.profile.remove(profileBefore.id);

        return isDeleted;
    }
}

module.exports = {
    ProfileService
};
