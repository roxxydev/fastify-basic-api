'use strict';

const Models = require('./models/model');

const { props: scopeProps, vals: scopeVals } = Models.scope;
const { props: roleProps, vals: roleVals } = Models.role;
const { props: privProps } = Models.privilege;


module.exports.run = async (fastify) => {

    const { store } = fastify;

    // Setup Scopes
    fastify.log.info('Initializing scopes...');
    for (const [module, moduleScope] of Object.entries(scopeVals)) {

        for (const scope of Object.values(moduleScope)) {

            const existingScope = await store.scope.get({ [scopeProps.name]: scope.name });

            if (!existingScope) {

                const data = await store.scope.create({
                    [scopeProps.name]: scope.name,
                    [scopeProps.description]: scope.description,
                    [scopeProps.module]: module,
                    [scopeProps.active]: true
                });

                fastify.log.info(`added new scope: ${data.name} with id ${data.id}`);
            }
        }
    }

    const setupPrivilege = async (role, scopes) => {

        fastify.log.info(`Setting privilege for ${role}...`);

        const roleData = await store.role.get({ [roleProps.name]: role });

        if (!roleData) {

            throw new Error(`No existing role found for ${role}`);
        }

        for (const scope of scopes) {

            const resScope = await store.scope.get({ [scopeProps.name]: scope.name });

            if (!resScope) {

                throw new Error(`No existing scope found for ${scope.name}`);
            }

            const existingPrivileges = await store.privilege.list({
                [privProps.roleId]: roleData.id,
                [privProps.scopeId]: resScope.id
            });

            if (!existingPrivileges.length) {

                await store.privilege.create({
                    [privProps.roleId]: roleData.id,
                    [privProps.scopeId]: resScope.id
                });
            }
        }
    };

    // Setup Roles
    fastify.log.info('Initializing roles...');
    for (const role of Object.values(roleVals)) {

        const existingRole = await store.role.get({
            [`${roleProps.name}`]: role.name
        });

        if (!existingRole) {

            await store.role.create({
                [roleProps.name]: role.name,
                [roleProps.description]: role.description
            });

            fastify.log.info(`added new role: ${role.name}`);
        }

        await setupPrivilege(role.name, role.scopes);
    }
};
