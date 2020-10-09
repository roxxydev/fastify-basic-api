'use strict';

const { ProfileService } = require('../../services/profileService');
const { profile: ScopeProfile } = require('../../../models/scope');


const {
    createSchema,
    getAllSchema,
    getOneSchema,
    updateSchema,
    deleteSchema
} = require('./schemas');

const profileRoutes = (app, options, done) => {

    const profileService = new ProfileService(app);

    // create

    app.post('/', {
        schema: createSchema,
        preValidation: [app.authenticate],
        config: {
            scopes: [ScopeProfile.prof_c]
        }
    }, async (request, reply) => {

        const { body } = request;
        const accountId = request.accountId;
        const created = await profileService.create({ accountId, payload: body });

        return created;
    });

    // get all
    app.get('/', {
        schema: getAllSchema,
        preValidation: [app.authenticate],
        config: {
            scopes: [ScopeProfile.prof_l]
        }
    }, async (request, reply) => {

        // TODO: Create search params to pass to filter
        const profiles = await profileService.getAll({});

        return profiles;
    });

    // get one
    app.get('/:profileId', {
        schema: getOneSchema,
        preValidation: [app.authenticate],
        config: {
            scopes: [ScopeProfile.prof_me, ScopeProfile.prof_v]
        }
    }, async (request, reply) => {

        const { params: { profileId } } = request;
        const profile = await profileService.get({ id: profileId });

        return profile;
    });

    // update
    app.patch('/:profileId', {
        schema: updateSchema,
        preValidation: [app.authenticate],
        config: {
            scopes: [ScopeProfile.prof_u]
        }
    }, async (request, reply) => {

        const { params: { profileId } } = request;
        const { body } = request;
        const updated = await profileService.update({ id: profileId, profile: body });

        return updated;
    });

    // delete
    app.delete('/:profileId', {
        schema: deleteSchema,
        preValidation: [app.authenticate],
        config: {
            scopes: [ScopeProfile.prof_d]
        }
    }, async (request, reply) => {

        const { params: { profileId } } = request;
        const deleted = await profileService.delete({ id: profileId });

        return deleted;
    });

    done();
};

module.exports = profileRoutes;
