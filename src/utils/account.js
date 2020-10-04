'use strict';

const Bcrypt = require('bcrypt');


module.exports = {
    encryptPswd: async (pswd) => {

        const rounds = 12;

        return await Bcrypt.hash(pswd, rounds);
    },
    comparePswd: async (pswd, encPswd) => {

        return await Bcrypt.compare(pswd, encPswd);
    }
};
