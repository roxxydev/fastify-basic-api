'use strict';

const mongoose = require('mongoose');
const Models = require('../models/model');

const { name, props } = Models.role;

const Schema = mongoose.Schema;

const schema = {
    [props.name]: {
        type: String,
        required: true,
        unique: true
    },
    [props.description]: String,
    created_at: { type: Date, default: Date.now() }
};

const roleModelSchema = new Schema(schema);

module.exports = mongoose.model(name, roleModelSchema);
