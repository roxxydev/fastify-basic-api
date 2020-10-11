'use strict';

const { AuthService } = require('../../services/authService');

const {
    loginSchema,
    refreshTokenSchema
} = require('./schemas');

const accountRoutes = (app, options, done) => {

    const authService = new AuthService(app);

    app.post('/login', { schema: loginSchema }, async (request, reply) => {

        const { body } = request;
        const account = await authService.login({ payload: body });
        const token = await authService.createToken(account.id);

        reply
            .header('Authorization', `Bearer ${ token }`)
            .send(account);
    });

    app.post('/refreshtoken', { schema: refreshTokenSchema }, async (request, reply) => {

        const { body } = request;
        const token = await authService.refreshToken({ payload: body });

        // TODO: Finish implementation of refresh token
        reply
            .header('Authorization', `Bearer ${ token }`)
            .send({});
    });

    done();
};

module.exports = accountRoutes;
