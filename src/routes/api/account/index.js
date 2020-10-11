'use strict';

const { AccountService } = require('../../services/accountService');
const { account: ScopeAccount } = require('../../../models/scope');


const {
    createSchema,
    getOwnAccountSchema,
    getAccountSchema
} = require('./schemas');

const accountRoutes = (app, options, done) => {

    const accountService = new AccountService(app);

    app.post('/register', { schema: createSchema }, async (request, reply) => {

        const { body } = request;
        const created = await accountService.create({ payload: body });

        reply.send(created);
    });

    app.get('/', {
        schema: getOwnAccountSchema,
        preValidation: [app.authenticate],
        config: {
            scopes: [ScopeAccount.acct_me]
        }
    }, async (request, reply) => {

        const account = await accountService.get({ id: request.accountId });

        reply.send(account);
    });

    app.get('/:accountId', {
        schema: getAccountSchema,
        preValidation: [app.authenticate],
        config: {
            scopes: [ScopeAccount.acct_v]
        }
    }, async (request, reply) => {

        const { params: { accountId } } = request;
        const account = await accountService.get({ id: accountId });

        reply.send(account);
    });

    done();
};

module.exports = accountRoutes;
