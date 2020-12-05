'use strict';

const mongoose = require('mongoose');
const Models = require('../models/model');

const { name, props } = Models.privilege;
const { name: roleName } = Models.role;
const { name: scopeName } = Models.scope;

const Schema = mongoose.Schema;

const schema = {
    [props.roleId]: {
        type: Schema.Types.ObjectId,
        required: true
    },
    [props.scopeId]: {
        type: Schema.Types.ObjectId,
        required: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: roleName
    },
    scope: {
        type: Schema.Types.ObjectId,
        ref: scopeName
    },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
};

const privilegeModelSchema = new Schema(schema);

module.exports = mongoose.model(name, privilegeModelSchema);
