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

        const created = await profileService.create({ profile: body });

        return created;
    });

    // get all
    app.get('/', { schema: getAllSchema }, async (request, reply) => {

        app.log.info('request.query', request.query);
        const profiles = await profileService.getAll({});

        return profiles;
    });

    // get one
    app.get('/:profileId', { schema: getOneSchema }, async (request, reply) => {

        const { params: { profileId } } = request;

        app.log.info('profileId', profileId);

        const profile = await profileService.getOne({ id: profileId });

        return profile;
    });

    // update
    app.patch('/:profileId', { schema: updateSchema }, async (request, reply) => {

        const { params: { profileId } } = request;

        const { body } = request;

        app.log.info('profileId', profileId);
        app.log.info('body', body);

        const updated = await profileService.update({ id: profileId, profile: body });

        return updated;
    });

    // delete
    app.delete('/:profileId', { schema: deleteSchema }, async (request, reply) => {

        const { params: { profileId } } = request;

        app.log.info('profileId', profileId);

        const deleted = await profileService.delete({ id: profileId });

        return deleted;
    });
};

module.exports = profileRoutes;
