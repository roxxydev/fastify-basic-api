'use strict';

const Model = require('../../models/model');
const { AccountService } = require('./accountService');

const { props } = Model.account;
const { props: propsAcctRole } = Model.accountRole;
const { props: propsPrivelges } = Model.privelege;


class AuthService {

    constructor(app) {

        if (!app.ready) {

            throw new Error(`can't get .ready from fastify app.`);
        }

        this.app = app;

        if (!app.knex) {

            throw new Error('cant get .knex from fastify app.');
        }

        this.knex = app.knex;
    }

    async login({ payload }) {

        if (!payload) {

            throw this.app.httpErrors.badRequest('missing payload');
        }

        const accountService = new AccountService(this.app);
        const account = await accountService.get({ [props.username]: payload.username });

        if (!account) {

            throw this.app.httpErrors.conflict(`account not existing.`);
        }

        if (payload[props.password]) {
            payload[props.password] = await this.app.utils.encryptPswd(payload[props.password]);
        }

        delete account[props.password];
        delete account.updated_at;

        return account;
    }

    async createToken(acctId) {

        const payload = { acctId };
        const key = await this.app.utils.encryptPswd(this.app.fastify.config.TOKEN_KEY);
        payload.key = key;

        const token = this.app.jwt.sign(payload, this.app.config.TOKEN_SECRET);

        return token;
    }

    async decodeToken(token) {

    }

    async refreshToken(args) {
        // TODO: Add refresh token implementation which should return token
    }

    async isAuthorize(accountId, routeScopes) {

        // TODO: Add checking of scopes for route request authorization
        const accountService = new AccountService(this.app);
        const account = await accountService.get({ id: accountId });

        if (account && routeScopes) {

            const accountScopes = [];
            const accountRoles = await this.store.accountRole.list({
                [propsAcctRole.accountId]: account.id
            });

            for (const accountRole of accountRoles) {

                const priveleges = await this.store.priveleges.get({
                    [propsPrivelges.roleId]: accountRole.roleId
                });

                for (const privelege of priveleges) {
                    accountScopes.push(privelege[propsPrivelges.scopeId]);
                }
            }

            // FIXME: complete code
            // accountScopes.some(acctScopes => routeScopes.)
        }

        return false;
    }
}

module.exports = {
    AuthService
};
