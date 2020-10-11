'use strict';

const Scope = require('./scope');
const Role = require('./role');


module.exports = {
    account: {
        name: 'account',
        props: {
            username: 'username',
            password: 'password',
            active: 'active'
        }
    },
    scope: {
        name: 'scope',
        props: {
            name: 'name',
            description: 'description',
            module: 'module',
            active: 'active'
        },
        vals: Scope
    },
    role: {
        name: 'role',
        props: {
            name: 'name',
            description: 'description'
        },
        vals: Role
    },
    accountRole: {
        name: 'account_role',
        props: {
            roleId: 'role_id',
            accountId: 'account_id',
            active: 'active'
        }
    },
    privilege: {
        name: 'privilege',
        props: {
            name: 'name',
            roleId: 'role_id',
            scopeId: 'scope_id'
        }
    },
    profile: {
        name: 'profile',
        props: {
            firstName: 'firstName',
            lastName: 'lastName',
            middleName: 'middleName',
            gender: 'gender',
            birthday: 'birthday',
            accountId: 'account_id'
        }
    }
};
