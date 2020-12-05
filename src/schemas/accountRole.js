'use strict';

const mongoose = require('mongoose');
const Models = require('../models/model');

const { name, props } = Models.accountRole;
const { name: roleName } = Models.role;

const Schema = mongoose.Schema;

const schema = {
    [props.accountId]: {
        type: Schema.Types.ObjectId,
        required: true
    },
    [props.roleId]: {
        type: Schema.Types.ObjectId,
        required: true
    },
    [props.active]: {
        type: Boolean,
        required: true,
        default: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: roleName
    },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
};

const accountRoleModelSchema = new Schema(schema);

module.exports = mongoose.model(name, accountRoleModelSchema);
