/* eslint no-console: 0 */
'use strict';

const Environment = require('./src/environment');
const Server = require('./src/server');

Server(Environment);

process.on('unhandledRejection', (reason, p) => {

    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
