'use strict';

const mongoose = require('mongoose');
const Models = require('../models/model');

const { name, props } = Models.scope;

const Schema = mongoose.Schema;

const schema = {
    [props.name]: {
        type: String,
        required: true,
        unique: true
    },
    [props.description]: String,
    [props.module]: {
        type: String,
        required: true
    },
    [props.active]: {
        type: Boolean,
        required: true,
        default: true
    },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
};

const scopeModelSchema = new Schema(schema);

module.exports = mongoose.model(name, scopeModelSchema);
