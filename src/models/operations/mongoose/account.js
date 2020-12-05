'use strict';

const Models = require('../../model');

const { name, props } = Models.account;

class AccountOps {

    constructor(mongoose) {

        this.models = mongoose.models;
        this.utils = mongoose.utils;
    }

    async create(payload, session) {

        const docAccount = await mongooseObj[name].create([payload]);

        let document;
        if(session) {
            document = docAccount.save(session);
        }
        else {
            document = mongooseObj[name].save(payload);
        }

        const returningProps = ['id', props.username, 'created_at'];
        const account = utils.getPublicFields(document, returningProps);

        return account;
    }

    async get(args) {

    }

    async list(filter) {

    }

    async update(args) {

    }

    async remove(id) {

    }
}

module.exports = AccountOps;
