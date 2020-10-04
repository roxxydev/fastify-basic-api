'use strict';

const { ProfileService } = require('../../services/profile');

const {
    createSchema,
    getAllSchema,
    getOneSchema,
    updateSchema,
    deleteSchema
} = require('./schemas');

const profileRoutes = async (app) => {

    const profileService = new ProfileService(app);

    // create
    app.post('/', { schema: createSchema }, async (request, reply) => {

        const { body } = request;
        const created = await profileService.create({ payload: body });

        return created;
    });

    // get all
    app.get('/', { schema: getAllSchema }, async (request, reply) => {

        const profiles = await profileService.getAll({});

        return profiles;
    });

    // get one
    app.get('/:profileId', { schema: getOneSchema }, async (request, reply) => {

        const { params: { profileId } } = request;
        const profile = await profileService.get({ id: profileId });

        return profile;
    });

    // update
    app.patch('/:profileId', { schema: updateSchema }, async (request, reply) => {

        const { params: { profileId } } = request;
        const { body } = request;
        const updated = await profileService.update({ id: profileId, profile: body });

        return updated;
    });

    // delete
    app.delete('/:profileId', { schema: deleteSchema }, async (request, reply) => {

        const { params: { profileId } } = request;
        const deleted = await profileService.delete({ id: profileId });

        return deleted;
    });
};

module.exports = profileRoutes;
