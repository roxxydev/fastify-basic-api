'use strict';

const FastifySwagger = require('fastify-swagger');
const { AuthService } = require('../services/authService');

const apiRoutes = (fastify, options, done) => {

    const authService = new AuthService(fastify);

    fastify.decorateRequest('accountId', '');

    fastify.decorate('authenticate', async (request, reply) => {

        // JWT payload claims
        const decoded = await request.jwtVerify();

        // For additional security, check if client is subject for authentication
        const matching = fastify.utils.comparePswd(fastify.conf.TOKEN_KEY, decoded.key);
        const jwtMessages = fastify.jwt.options.messages;

        if (!matching || !decoded.acctId) {

            throw fastify.httpErrors.badRequest(jwtMessages.authorizationTokenInvalid());
        }

        const { scopes } = reply.context.config;
        const isAuthorized = authService.isAuthorize(decoded.acctId, scopes);

        if (!isAuthorized) {

            throw fastify.httpErrors.badRequest(jwtMessages.authorizationTokenInvalid());
        }

        request.accountId = decoded.acctId;
    });

    fastify.get('/', () => {

        return {};
    });

    fastify.register(FastifySwagger, require('../docs'));
    fastify.register(require('./auth'), { prefix: 'auth' });
    fastify.register(require('./account'), { prefix: 'account' });
    fastify.register(require('./profile'), { prefix: 'profile' });

    done();
};

module.exports = apiRoutes;
