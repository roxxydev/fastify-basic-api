'use strict';

module.exports = {
    routePrefix: '/documentation',
    exposeRoute: true,
    swagger: {
        info: {
            title: 'fastify basic api',
            description: 'docs',
            version: '0.1.0'
        },
        externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
        },
        servers: [
            { url: `http://localhost:${ process.env.APP_PORT }`, description: 'local development' }
        ],
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
            { name: 'account', description: 'Account related end-points' },
            { name: 'profile', description: 'Profile related end-points' }
        ]
    }
};
