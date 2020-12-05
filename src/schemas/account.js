'use strict';

const mongoose = require('mongoose');
const Models = require('../models/model');

const { name, props } = Models.account;

const Schema = mongoose.Schema;

const schema = {
    [props.username]: {
        type: String,
        required: true,
    },
    [props.active]: {
        type: Boolean,
        required: true,
        default: true
    },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
};

const accountModelSchema = new Schema(schema);

accountModelSchema.getPublicFields = (propsToReturn) => {

    
};

module.exports = mongoose.model(name, accountModelSchema);
