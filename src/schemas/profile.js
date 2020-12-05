'use strict';

const mongoose = require('mongoose');
const Models = require('../models/model');

const { name, props } = Models.profile;

const Schema = mongoose.Schema;

const schema = {

    [props.firstName]: {
        type: String,
        required: true
    },
    [props.lastName]: {
        type: String,
        required: true
    },
    [props.middleName]: String,
    [props.gender]: {
        type: String,
        required: true
    },
    [props.birthday]: {
        type: Date,
        required: true
    },
    [props.accountId]: {
        type: Schema.Types.ObjectId,
        required: true
    },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
};

const profileModelSchema = new Schema(schema);

module.exports = mongoose.model(name, profileModelSchema);
