'use strict';

module.exports = {
    account: {
        name: 'account',
        props: {
            username: 'username',
            password: 'password'
        }
    },
    profile: {
        name: 'profile',
        props: {
            accountId: 'account_id',
            firstName: 'firstName',
            lastName: 'lastName',
            middleName: 'middleName',
            gender: 'gender',
            birthday: 'birthday'
        }
    }
};
