'use strict';

const { AccountService } = require('../../services/accountService');
const { account: ScopeAccount } = require('../../../models/scope');


const {
    createSchema,
    getSchema
} = require('./schemas');

const accountRoutes = (app, options, done) => {

    const accountService = new AccountService(app);

    app.post('/register', { schema: createSchema }, async (request, reply) => {

        const { body } = request;
        const created = await accountService.create({ payload: body });

        return created;
    });

    app.get('/:accountId', {
        schema: getSchema,
        preValidation: [app.authenticate],
        config: {
            scopes: [ScopeAccount.acct_me, ScopeAccount.acct_v]
        }
    }, async (request, reply) => {

        const { params: { accountId } } = request;
        const account = await accountService.get({ id: accountId });

        return account;
    });

    done();
};

module.exports = accountRoutes;
