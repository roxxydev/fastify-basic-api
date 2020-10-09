'use strict';


class RoleService {

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

    async get(args) {

        const { id, name } = args;
        let role;

        if (!id || !name) {

            throw this.app.httpErrors.badRequest('missing parameters.');
        }

        if (id) {
            role = await this.store.role.get({ id });
        }

        if (name) {
            role = await this.store.role.get({ name });
        }

        if (!role) {

            throw this.app.httpErrors.notFound(`role ${id} not found.`);
        }

        return role;
    }
}

module.exports = {
    RoleService
};
