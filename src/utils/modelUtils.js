'use strict';

const _ = require('lodash/core');


module.exports = {
    getPublicFields: async (document, returningProps) => {

        if (document && Array.isArray(returningProps)) {

            return _.pick(document.toObject, returningProps)
        }

        return document;
    }
};
