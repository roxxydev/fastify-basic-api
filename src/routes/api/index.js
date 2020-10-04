'use strict';

const apiRoutes = async (app, options) => {

    app.get('/', async () => {

        return {};
    });

    app.register(require('./account'), { prefix: 'account' });
    app.register(require('./profile'), { prefix: 'profile' });
};

module.exports = apiRoutes;
