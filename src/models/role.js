'use strict';

const Scope = require('./scope');


module.exports = {
    admin: {
        name: 'admin',
        description: 'Administrator',
        scopes: [
            ...Object.values(Scope.account),
            ...Object.values(Scope.profile)
        ]
    },
    user: {
        name: 'user',
        description: 'User',
        scopes: [
            Scope.profile.prof_me,
            Scope.profile.prof_c,
            Scope.profile.prof_u
        ]
    }
};
