'use strict';

const FastifySwagger = require('fastify-swagger');
const { AuthService } = require('../services/authService');

const apiRoutes = (fastify, options, done) => {

    const authService = new AuthService(fastify);

    fastify.decorate('authenticate', async (request, reply, done) => {

        try {
            const decoded = await request.jwtVerify();

            const { payload } = decoded;

            // For additional security, check if client is subject for authentication
            const matching = fastify.utils.comparePswd(fastify.config.TOKEN_KEY, payload.key);
            const jwtMessages = fastify.jwt.options.messages;

            if (!matching || !payload.acctId) {

                throw fastify.httpErrors.badRequest(jwtMessages.authorizationTokenInvalid());
            }

            const { scopes } = reply.context.config;
            const isAuthorized = authService.isAuthorize(payload.acctId, scopes);

            if (!isAuthorized) {

                throw fastify.httpErrors.badRequest(jwtMessages.authorizationTokenInvalid());
            }

            await fastify.decorateRequest('accountId', payload.acctId);

            return done();
        }
        catch (err) {

            reply.send(err);
        }
    });

    fastify.get('/', () => {

        return {};
    });

    fastify.register(FastifySwagger, require('../docs'));
    fastify.register(require('./account'), { prefix: 'account' });
    fastify.register(require('./profile'), { prefix: 'profile' });

    done();
};

module.exports = apiRoutes;
