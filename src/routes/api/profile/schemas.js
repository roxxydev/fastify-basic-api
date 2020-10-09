'use strict';

const S = require('fluent-schema');
const Model = require('../../../models/model');


const { name, props } = Model.profile;
Object.assign(props, Model.account.props);

const GENDER = {
    MALE: 'male',
    FEMALE: 'female'
};

const profileSchema = {
    profileId: {
        key: 'profileId',
        type: S.mixed([S.TYPES.STRING, S.TYPES.NUMBER])
    },
    firstName: {
        key: props.firstName,
        type: S.string()
            .minLength(1)
            .maxLength(100)
    },
    lastName: {
        key: props.lastName,
        type: S.string()
            .minLength(1)
            .maxLength(100)
    },
    middleName: {
        key: props.middleName,
        type: S.string()
            .minLength(1)
            .maxLength(100)
    },
    gender: {
        key: props.gender,
        type: S.enum(Object.values(GENDER))
    },
    birthday: {
        key: props.birthday,
        type: S.raw({ type: 'string', format: 'date' })
    }
};

const tags = [name];
const paramsSchema = S.object().prop(profileSchema.profileId.key, profileSchema.profileId.type);
const querySchema = S.object().prop('filter', S.string());

const getAllSchema = {
    tags,
    querystring: querySchema
};

const getOneSchema = {
    tags,
    params: paramsSchema,
    querystring: querySchema
};

const createSchema = {
    tags,
    body: S.object()
        .prop(profileSchema.firstName.key, profileSchema.firstName.type).required()
        .prop(profileSchema.lastName.key, profileSchema.lastName.type).required()
        .prop(profileSchema.middleName.key, profileSchema.middleName.type)
        .prop(profileSchema.gender.key, profileSchema.gender.type).required()
        .prop(profileSchema.birthday.key, profileSchema.birthday.type).required()
};

const updateSchema = {
    tags,
    params: paramsSchema,
    body: S.object()
        .prop(profileSchema.firstName.key, profileSchema.firstName.type)
        .prop(profileSchema.lastName.key, profileSchema.lastName.type)
        .prop(profileSchema.middleName.key, profileSchema.middleName.type)
};

const deleteSchema = {
    tags,
    params: paramsSchema
};

module.exports = {
    getAllSchema,
    getOneSchema,
    createSchema,
    updateSchema,
    deleteSchema
};
