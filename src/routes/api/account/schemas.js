'use strict';

const S = require('fluent-schema');
const Model = require('../../../models/model');
const { authHeaderSchema } = require('../auth/schemas');


const { name, props } = Model.account;

const accountSchema = {
    accountId: {
        key: 'accountId',
        type: S.mixed([S.TYPES.STRING, S.TYPES.NUMBER])
    },
    username: {
        key: props.username,
        type: S.string()
            .minLength(8)
            .maxLength(30)
            .pattern(/[a-zA-Z0-9_]*/g)
            .required()
    },
    password: {
        key: props.password,
        type: S.string()
            .minLength(8)
            .maxLength(50)
            .required()
    }
};

const tags = [name];
const paramsSchema = S.object().prop(accountSchema.accountId.key, accountSchema.accountId.type);

const createSchema = {
    tags,
    description: 'Create account',
    body: S.object()
        .prop(accountSchema.username.key, accountSchema.username.type)
        .prop(accountSchema.password.key, accountSchema.password.type)
};

const getAccountSchema = {
    tags,
    params: paramsSchema,
    ...authHeaderSchema
};

const getOwnAccountSchema = {
    tags,
    ...authHeaderSchema
};

module.exports = {
    createSchema,
    getAccountSchema,
    getOwnAccountSchema
};
