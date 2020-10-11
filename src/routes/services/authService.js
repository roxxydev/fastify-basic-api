'use strict';

const Model = require('../../models/model');
const { AccountService } = require('./accountService');

const { props } = Model.account;
const { props: propsAcctRole } = Model.accountRole;
const { props: propsPrivilege } = Model.privilege;
const { props: propsScope } = Model.scope;


class AuthService {

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

    async login({ payload }) {

        if (!payload) {

            throw this.app.httpErrors.badRequest('missing payload');
        }

        const accountService = new AccountService(this.app);
        const account = await accountService.get({ [props.username]: payload.username });

        if (payload[props.password]) {
            payload[props.password] = await this.app.utils.encryptPswd(payload[props.password]);
        }

        delete account[props.password];
        delete account.updated_at;

        return account;
    }

    async createToken(acctId) {

        const payload = { acctId };
        const key = await this.app.utils.encryptPswd(this.app.conf.TOKEN_KEY);
        payload.key = key;

        const token = this.app.jwt.sign(payload);

        return token;
    }

    async decodeToken(token) {

    }

    async refreshToken(args) {
        // TODO: Add refresh token implementation which should return token
    }

    async isAuthorize(accountId, routeScopes) {

        const accountService = new AccountService(this.app);
        const account = await accountService.get({ id: accountId });

        if (account && routeScopes) {

            const accountScopesIds = [];
            const accountRoles = await this.store.accountRole.list({
                [propsAcctRole.accountId]: account.id
            });

            for (const accountRole of accountRoles) {

                const privileges = await this.store.privilege.list({
                    [propsPrivilege.roleId]: accountRole[propsAcctRole.roleId]
                });

                for (const privilege of privileges) {
                    accountScopesIds.push(privilege[propsPrivilege[propsPrivilege.scopeId]]);
                }
            }

            const scopesRoutesIds = [];

            for (const routeScope of routeScopes) {

                const resScope = await this.store.scope.get({ [propsScope.name]: routeScope[propsScope.name] });

                if (!resScope) {

                    this.app.log.error(`No existing route scope found for ${routeScope[propsScope.name]}`);
                    throw this.app.httpErrors.unauthorized();
                }

                scopesRoutesIds.push(resScope.id);
            }

            const permitted = scopesRoutesIds.some((routeScopeId) => {

                return accountScopesIds.indexOf(routeScopeId) >= 0;
            });

            return permitted;
        }

        return false;
    }
}

module.exports = {
    AuthService
};
