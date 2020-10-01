'use strict';

const apiRoutes = async (app, options) => {

    app.register(require('./profile'), { prefix: 'profile' });
};

module.exports = apiRoutes;
