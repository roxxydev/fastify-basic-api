'use strict';

const { AccountService } = require('../../services/account');

const {
    createSchema,
    getSchema
} = require('./schemas');

const accountRoutes = async (app) => {

    const accountService = new AccountService(app);

    app.post('/register', { schema: createSchema }, async (request, reply) => {

        const { body } = request;
        const created = await accountService.create({ payload: body });

        return created;
    });

    app.get('/:accountId', { schema: getSchema }, async (request, reply) => {

        const { params: { accountId } } = request;
        const account = await accountService.get({ id: accountId });

        return account;
    });
};

module.exports = accountRoutes;
