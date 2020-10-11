'use strict';

const { RoleService } = require('./roleService');
const Model = require('../../models/model');

const { props } = Model.account;
const { props: propsRole } = Model.accountRole;
const { vals: roles } = Model.role;


class AccountService {

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

    async create({ payload }) {

        if (!payload) {

            throw this.app.httpErrors.badRequest('missing payload');
        }

        const existingAcct = await this.store.account.get({ [props.username]: payload.username });

        if (existingAcct) {

            throw this.app.httpErrors.conflict('username already exists.');
        }

        if (payload[props.password]) {
            payload[props.password] = await this.app.utils.encryptPswd(payload[props.password]);
        }

        return await this.store.runInTransaction(async (trx) => {

            const account = await this.store.account.create(payload, trx);
            let roleId;

            const roleService = new RoleService(this.app);
            if (payload.role) {
                const role = await roleService.get({ name: payload.role });

                if (role) {
                    roleId = role.id;
                }
            }
            else {
                const role = await roleService.get({ name: roles.user.name });
                roleId = role.id;
            }

            await this.store.accountRole.create({
                [propsRole.roleId]: roleId,
                [propsRole.accountId]: account.id
            }, trx);

            return account;
        });
    }

    async get(args) {

        const { id, username } = args;
        let account;

        if (!id && !username) {

            throw this.app.httpErrors.badRequest('missing parameters.');
        }

        if (id) {
            account = await this.store.account.get({ id });
        }

        if (username) {
            account = await this.store.account.get({ username });
        }

        if (!account) {

            throw this.app.httpErrors.notFound('account not found.');
        }

        return account;
    }

    async getAll(filter) {

        return await this.store.account.list(filter);
    }
}

module.exports = {
    AccountService
};
