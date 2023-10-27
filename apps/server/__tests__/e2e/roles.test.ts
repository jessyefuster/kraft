import type { RolesCreateBody } from '@internal/types';
import type { Server } from 'http';
import request from 'supertest';

import { AppDataSource } from '../../src/data-source';
import { RoleEntity } from '../../src/entities/role';
import { ALL_PERMISSIONS } from '../../src/models/permissions';
import { createTestRole, getPermissions, getRole, getRootRole } from '../utils/roleHelpers';
import { clearDatabase, closeDatabase, createAuthenticatedAgent, createTestServer } from '../utils/testsHelpers';

let server: Server;

beforeAll(async() => {
    server = await createTestServer();
});

afterAll(async () => {
    await closeDatabase();
    server.close();
});

describe('Roles routes', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    test('Get roles list', async () => {
        const agent = await createAuthenticatedAgent(server);

        const res1 = await agent.get('/api/roles');
        expect(res1.statusCode).toEqual(200);
        expect(res1.body).toHaveLength(1);

        const fakeRole = await createTestRole({
            name: 'fakeRole'
        });

        const res2 = await agent.get('/api/roles');
        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toHaveLength(2);

        const roleRepo = AppDataSource.getRepository(RoleEntity);
        await roleRepo.remove(fakeRole);

        const res3 = await agent.get('/api/roles');
        expect(res3.statusCode).toEqual(200);
        expect(res3.body).toHaveLength(1);
    });

    test('Get roles fails if unauthenticated', async () => {
        const res = await request(server).get('/api/roles');

        expect(res.statusCode).toEqual(401);
    });

    test('Get roles fails if unauthorized', async () =>  {
        const noPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'noPermissionUser', email: 'noPermissionUser@gmail.com' },
            permissions: []
        });

        const noPermissionRes = await noPermissionAgent.get('/api/roles');
        expect(noPermissionRes.statusCode).toEqual(403);

        const lowPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'lowPermissionUser', email: 'lowPermissionUser@gmail.com' },
            permissions: ALL_PERMISSIONS.filter(permission => permission !== 'read:roles')
        });
        const lowPermissionRes = await lowPermissionAgent.get('/api/roles');
        expect(lowPermissionRes.statusCode).toEqual(403);
    });

    test('Create a role', async () => {
        const agent = await createAuthenticatedAgent(server);
        const permissionsEntities = await getPermissions(['read:users', 'delete:roles']);
        const permissionsCount = permissionsEntities.length;
        const permissionsIds = permissionsEntities.map(p => p.id);
        const permissionsCodes = permissionsEntities.map(p => p.code);

        const roleData: RolesCreateBody = {
            name: 'Fake role',
            description: 'Fake description'
        };

        const payload: RolesCreateBody = {
            ...roleData,
            permissionsIds
        };

        const res = await agent.post('/api/roles').send(payload);
        const roleEntity = await getRole(roleData.name);

        expect(res.statusCode).toEqual(201);
        expect(roleEntity).not.toBeNull();

        expect(res.body).toMatchObject({ ...roleData, permissions: expect.any(Array) });
        expect(roleEntity).toMatchObject({ ...roleData, permissions: expect.any(Array), isRoot: false });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resPermissions = res.body.permissions as any[];
        expect(resPermissions).toHaveLength(permissionsCount);

        for (const permissionCode of permissionsCodes) {
            expect(resPermissions).toContainEqual(expect.objectContaining({ code: permissionCode }));
        }

        const roleEntityPermissions = roleEntity!.permissions;
        expect(roleEntityPermissions).toHaveLength(permissionsCount);

        for (const permissionCode of permissionsCodes) {
            expect(roleEntityPermissions).toContainEqual(expect.objectContaining({ code: permissionCode }));
        }
    });

    test('Role fails if query body is invalid', async () => {
        const agent = await createAuthenticatedAgent(server);

        const res = await agent.post('/api/roles').send({ description: 'I dont have a name' });

        expect(res.statusCode).toEqual(400);
    });

    test('Role creation fails if role already exists', async () => {
        const agent = await createAuthenticatedAgent(server);
        const rootRoleEntity = await getRootRole();

        const payload: RolesCreateBody = {
            name: rootRoleEntity.name
        };

        const res = await agent.post('/api/roles').send(payload);

        expect(res.statusCode).toEqual(409);
    });

    test('Role creation fails if non-existent permissions', async () => {
        const agent = await createAuthenticatedAgent(server);
        const [permissionEntity] = await getPermissions(['read:users']);

        const payload: RolesCreateBody = {
            name: 'testRole',
            permissionsIds: [permissionEntity.id, 'fakeId']
        };

        const res = await agent.post('/api/roles').send(payload);

        expect(res.statusCode).toEqual(422);
    });
    
    test('Role creation fails if unauthenticated', async () => {
        const res = await request(server).post('/api/roles');

        expect(res.statusCode).toEqual(401);
    });

    test('Role creation fails if unauthorized', async () =>  {
        const noPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'noPermissionUser', email: 'noPermissionUser@gmail.com' },
            permissions: []
        });

        const noPermissionRes = await noPermissionAgent.post('/api/roles');
        expect(noPermissionRes.statusCode).toEqual(403);

        const lowPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'lowPermissionUser', email: 'lowPermissionUser@gmail.com' },
            permissions: ALL_PERMISSIONS.filter(permission => permission !== 'create:roles')
        });
        const lowPermissionRes = await lowPermissionAgent.post('/api/roles');
        expect(lowPermissionRes.statusCode).toEqual(403);
    });

    test('Delete a role', async () => {
        const agent = await createAuthenticatedAgent(server);

        const roleEntity = await createTestRole({
            name: 'fakeRole'
        });

        const res = await agent.delete(`/api/roles/${roleEntity.id}`);
        const repoRoleEntity = await getRole(roleEntity.name);
        
        expect(res.statusCode).toEqual(204);
        expect(repoRoleEntity).toBeNull();
    });

    test('Role deletion fails if role doesn\'t exist', async () => {
        const agent = await createAuthenticatedAgent(server);
        const res = await agent.delete('/api/roles/fakeRoleId');

        expect(res.statusCode).toEqual(404);
    });

    test('Role deletion fails if role is root', async () => {
        const agent = await createAuthenticatedAgent(server);
        const rootRoleEntity = await createTestRole({ name: 'fakeRootRole' }, true);

        const res = await agent.delete(`/api/roles/${rootRoleEntity.id}`);

        expect(res.statusCode).toEqual(403);
    });

    test('Role deletion fails if unauthenticated', async () => {
        const res = await request(server).delete('/api/roles/fakeRoleId');

        expect(res.statusCode).toEqual(401);
    });

    test('Role deletion fails if unauthorized', async () =>  {
        const noPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'noPermissionUser', email: 'noPermissionUser@gmail.com' },
            permissions: []
        });

        const noPermissionRes = await noPermissionAgent.delete('/api/roles/fakeRoleId');
        expect(noPermissionRes.statusCode).toEqual(403);

        const lowPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'lowPermissionUser', email: 'lowPermissionUser@gmail.com' },
            permissions: ALL_PERMISSIONS.filter(permission => permission !== 'delete:roles')
        });
        const lowPermissionRes = await lowPermissionAgent.delete('/api/roles/fakeRoleId');
        expect(lowPermissionRes.statusCode).toEqual(403);
    });

    test('Get role', async () => {
        const agent = await createAuthenticatedAgent(server);
        const rootRoleEntity = await getRootRole();
        
        const res = await agent.get(`/api/roles/${rootRoleEntity.id}`);
        
        expect(res.statusCode).toEqual(200);
    });

    test('Get role fails if unauthenticated', async () => {
        const res = await request(server).get('/api/roles/fakeRoleId');

        expect(res.statusCode).toEqual(401);
    });

    test('Get role fails if unauthorized', async () =>  {
        const noPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'noPermissionUser', email: 'noPermissionUser@gmail.com' },
            permissions: []
        });

        const noPermissionRes = await noPermissionAgent.get('/api/roles/fakeRoleId');
        expect(noPermissionRes.statusCode).toEqual(403);

        const lowPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'lowPermissionUser', email: 'lowPermissionUser@gmail.com' },
            permissions: ALL_PERMISSIONS.filter(permission => permission !== 'read:roles')
        });
        const lowPermissionRes = await lowPermissionAgent.get('/api/roles/fakeRoleId');
        expect(lowPermissionRes.statusCode).toEqual(403);
    });
});