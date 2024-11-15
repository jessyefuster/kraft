import type { RoleEditBody, RolePermissionsAddBody, RolesCreateBody } from '@internal/types';
import type { Server } from 'http';
import request from 'supertest';

import { AppDataSource } from '../../src/data-source';
import { RoleEntity } from '../../src/entities/role';
import { ALL_PERMISSIONS } from '../../src/models/permissions';
import { createTestRole, getPermissions, getRole, getRootRole } from '../utils/roleHelpers';
import { clearDatabase, closeDatabase, createAuthenticatedAgent, createTestServer } from '../utils/testsHelpers';
import { fakeUUID } from '../utils/uuid';

let server: Server;

beforeAll(async() => {
    server = await createTestServer();
});

afterAll(async () => {
    await closeDatabase();
    server.close();
});

describe('Roles routes', () => {

    describe('GET /roles', () => {
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
    });

    describe('POST /roles', () => {
        beforeEach(async () => {
            await clearDatabase();
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
            const roleEntity = await getRole({ name: roleData.name });
    
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
    
            const payload2: RolesCreateBody = {
                name: 'testRole',
                permissionsIds: [permissionEntity.id, fakeUUID]
            };
    
            const res2 = await agent.post('/api/roles').send(payload2);
    
            expect(res2.statusCode).toEqual(422);
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
    });

    describe('DELETE /roles/:id', () => {
        beforeEach(async () => {
            await clearDatabase();
        });

        test('Delete a role', async () => {
            const agent = await createAuthenticatedAgent(server);
    
            const roleEntity = await createTestRole({
                name: 'fakeRole'
            });
    
            const res = await agent.delete(`/api/roles/${roleEntity.id}`);
            const repoRoleEntity = await getRole({ name: roleEntity.name });
            
            expect(res.statusCode).toEqual(204);
            expect(repoRoleEntity).toBeNull();
        });
    
        test('Role deletion fails if role doesn\'t exist', async () => {
            const agent = await createAuthenticatedAgent(server);
            const res = await agent.delete('/api/roles/fakeRoleId');
    
            expect(res.statusCode).toEqual(404);
    
            const res2 = await agent.delete(`/api/roles/${fakeUUID}`);
    
            expect(res2.statusCode).toEqual(404);
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
    });
    
    describe('GET /roles/:id', () => {
        beforeEach(async () => {
            await clearDatabase();
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
    
        test('Get role fails if unauthorized', async () => {
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
    
        test('Get role fails if role doesn\'t exist', async () => {
            const agent = await createAuthenticatedAgent(server);
            const res = await agent.get('/api/roles/fakeRoleId');
    
            expect(res.statusCode).toEqual(404);
    
            const res2 = await agent.get(`/api/roles/${fakeUUID}`);
    
            expect(res2.statusCode).toEqual(404);
        });
    });

    describe('PATCH /roles/:id', () => {
        beforeEach(async () => {
            await clearDatabase();
        });

        test('Update a role', async () => {
            const agent = await createAuthenticatedAgent(server);
            const roleEntity = await createTestRole();
    
            // change all data
            const fullDataPayload: RoleEditBody = {
                name: 'Role name',
                description: 'Role description'
            };
            
            const fullUpdateRes = await agent.patch(`/api/roles/${roleEntity.id}`).send(fullDataPayload);
            const roleEntityAfterFullUpdate = await getRole({ id: roleEntity.id });
    
            expect(fullUpdateRes.statusCode).toEqual(200);
    
            expect(roleEntityAfterFullUpdate!.name).toEqual(fullDataPayload.name);
            expect(roleEntityAfterFullUpdate!.description).toEqual(fullDataPayload.description);
    
            // change description only
            const descriptionOnlyPayload: RoleEditBody = {
                description: 'New role description'
            };
    
            const descriptionOnlyRes = await agent.patch(`/api/roles/${roleEntity.id}`).send(descriptionOnlyPayload);
            const roleEntityAfterDescriptionUpdate = await getRole({ id: roleEntity.id });
    
            expect(descriptionOnlyRes.statusCode).toEqual(200);
    
            expect(roleEntityAfterDescriptionUpdate!.name).toEqual(roleEntityAfterFullUpdate!.name);
            expect(roleEntityAfterDescriptionUpdate!.description).toEqual(descriptionOnlyPayload.description);
    
            // change name only
            const nameOnlyPayload: RoleEditBody = {
                name: 'New role name'
            };
    
            const nameOnlyRes = await agent.patch(`/api/roles/${roleEntity.id}`).send(nameOnlyPayload);
            const roleEntityAfterNameUpdate = await getRole({ id: roleEntity.id });
    
            expect(nameOnlyRes.statusCode).toEqual(200);
    
            expect(roleEntityAfterNameUpdate!.name).toEqual(nameOnlyPayload.name);
            expect(roleEntityAfterNameUpdate!.description).toEqual(roleEntityAfterDescriptionUpdate!.description);
    
            // change name only
            const removeDescriptionPayload: RoleEditBody = {
                description: ''
            };
    
            const removeDescriptionRes = await agent.patch(`/api/roles/${roleEntity.id}`).send(removeDescriptionPayload);
            const roleEntityAfterDescriptionRemove = await getRole({ id: roleEntity.id });
    
            expect(removeDescriptionRes.statusCode).toEqual(200);
    
            expect(roleEntityAfterDescriptionRemove!.description).toBeNull();
        });
    
        test('Update a role fails if unauthenticated', async () => {
            const res = await request(server).patch('/api/roles/fakeRoleId');
    
            expect(res.statusCode).toEqual(401);
        });
    
        test('Update a role fails if unauthorized', async () => {
            const noPermissionAgent = await createAuthenticatedAgent(server, {
                user: { username: 'noPermissionUser', email: 'noPermissionUser@gmail.com' },
                permissions: []
            });
    
            const noPermissionRes = await noPermissionAgent.patch('/api/roles/fakeRoleId');
            expect(noPermissionRes.statusCode).toEqual(403);
    
            const lowPermissionAgent = await createAuthenticatedAgent(server, {
                user: { username: 'lowPermissionUser', email: 'lowPermissionUser@gmail.com' },
                permissions: ALL_PERMISSIONS.filter(permission => permission !== 'update:roles')
            });
            const lowPermissionRes = await lowPermissionAgent.patch('/api/roles/fakeRoleId');
            expect(lowPermissionRes.statusCode).toEqual(403);
        });
    
        test('Update a role fails if role is root', async () => {
            const agent = await createAuthenticatedAgent(server);
            const rootRoleEntity = await getRootRole();
    
            const res = await agent.patch(`/api/roles/${rootRoleEntity.id}`);
    
            expect(res.statusCode).toEqual(405);
        });
    
        test('Update a role fails if query body is invalid', async () => {
            const agent = await createAuthenticatedAgent(server);
            const roleEntity = await createTestRole();
    
            const conflictingNamePayload: RoleEditBody = {
                name: ''
            };
            
            const conflictingRes = await agent.patch(`/api/roles/${roleEntity.id}`).send(conflictingNamePayload);
    
            expect(conflictingRes.statusCode).toEqual(400);
        });
    
        test('Update a role fails if data is conflicting', async () => {
            const agent = await createAuthenticatedAgent(server);
            const rootRoleEntity = await getRootRole();
            const roleEntity = await createTestRole();
    
            const payload: RoleEditBody = {
                name: rootRoleEntity.name
            };
            
            const res = await agent.patch(`/api/roles/${roleEntity.id}`).send(payload);
    
            expect(res.statusCode).toEqual(409);
        });
    
        test('Update a role fails if role doesn\'t exist', async () => {
            const agent = await createAuthenticatedAgent(server);
            const res = await agent.patch('/api/roles/fakeRoleId');
    
            expect(res.statusCode).toEqual(404);
    
            const res2 = await agent.patch(`/api/roles/${fakeUUID}`);
    
            expect(res2.statusCode).toEqual(404);
        });
    });

    describe('GET /roles/:id/permissions', () => {
        beforeEach(async () => {
            await clearDatabase();
        });

        test('Get role permissions', async () => {
            const agent = await createAuthenticatedAgent(server);
            const rootRoleEntity = await getRootRole();
            
            const res = await agent.get(`/api/roles/${rootRoleEntity.id}/permissions`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body).toMatchObject(expect.any(Array));
        });
    
        test('Get role permissions fails if unauthenticated', async () => {
            const res = await request(server).get('/api/roles/fakeRoleId/permissions');
    
            expect(res.statusCode).toEqual(401);
        });
    
        test('Get role permissions fails if unauthorized', async () => {
            const noPermissionAgent = await createAuthenticatedAgent(server, {
                user: { username: 'noPermissionUser', email: 'noPermissionUser@gmail.com' },
                permissions: []
            });
    
            const noPermissionRes = await noPermissionAgent.get('/api/roles/fakeRoleId/permissions');
            expect(noPermissionRes.statusCode).toEqual(403);
    
            const lowPermissionAgent = await createAuthenticatedAgent(server, {
                user: { username: 'lowPermissionUser', email: 'lowPermissionUser@gmail.com' },
                permissions: ALL_PERMISSIONS.filter(permission => permission !== 'read:roles')
            });
            const lowPermissionRes = await lowPermissionAgent.get('/api/roles/fakeRoleId/permissions');
            expect(lowPermissionRes.statusCode).toEqual(403);
        });
    
        test('Get role permissions fails if role doesn\'t exist', async () => {
            const agent = await createAuthenticatedAgent(server);
            const res = await agent.get('/api/roles/fakeRoleId/permissions');
    
            expect(res.statusCode).toEqual(404);
    
            const res2 = await agent.get(`/api/roles/${fakeUUID}/permissions`);
    
            expect(res2.statusCode).toEqual(404);
        });
    });

    describe('POST /roles/:id/permissions', () => {
        beforeEach(async () => {
            await clearDatabase();
        });

        test('Add permissions', async () => {
            const agent = await createAuthenticatedAgent(server);
            const roleEntity = await createTestRole({ permissions: [] });

            const permissions = await getPermissions(['read:users', 'delete:users']);
            const permissionsIds = permissions.map(p => p.id);
            const permissionsCount = permissionsIds.length;

            const payload: RolePermissionsAddBody = {
                permissionsIds
            };

            const res = await agent.post(`/api/roles/${roleEntity.id}/permissions`).send(payload);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(permissionsCount);

            for (const permissionId of permissionsIds) {
                expect(res.body).toContainEqual(expect.objectContaining({ id: permissionId }));
            }

            // check role entity
            const afterUpdateRoleEntity = await getRole({ id: roleEntity.id });

            expect(afterUpdateRoleEntity?.permissions).toHaveLength(permissionsCount);

            for (const permissionId of permissionsIds) {
                expect(afterUpdateRoleEntity?.permissions).toContainEqual(expect.objectContaining({ id: permissionId }));
            }
        });

        test('Add permissions with empty array', async () => {
            const agent = await createAuthenticatedAgent(server);
            const rolePermissionsCodes = ['read:users', 'delete:users'] as const;
            const permissions = await getPermissions([...rolePermissionsCodes]);
            const permissionsIds = permissions.map(p => p.id);
            const permissionsCount = permissions.length;
            const roleEntity = await createTestRole({ permissions: [...rolePermissionsCodes] });

            const payload: RolePermissionsAddBody = {
                permissionsIds: []
            };

            const res = await agent.post(`/api/roles/${roleEntity.id}/permissions`).send(payload);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(permissionsCount);

            // check role entity
            const afterUpdateRoleEntity = await getRole({ id: roleEntity.id });

            expect(afterUpdateRoleEntity?.permissions).toHaveLength(permissionsCount);

            for (const permissionId of permissionsIds) {
                expect(afterUpdateRoleEntity?.permissions).toContainEqual(expect.objectContaining({ id: permissionId }));
            }
        });

        test('Add permissions with duplicates', async () => {
            const agent = await createAuthenticatedAgent(server);
            const rolePermissionsCodes = ['read:users', 'delete:users'] as const;
            const permissions = await getPermissions([...rolePermissionsCodes]);
            const permissionsIds = permissions.map(p => p.id);
            const roleEntity = await createTestRole({ permissions: [...rolePermissionsCodes] });

            const permissionsToAdd = await getPermissions(['create:roles', 'read:roles']);
            const permissionsToAddIds = permissionsToAdd.map(p => p.id);

            const payload: RolePermissionsAddBody = {
                permissionsIds: [...permissionsIds, ...permissionsIds, ...permissionsToAddIds]
            };

            const expectedPermissionsIds = [...permissionsIds, ...permissionsToAddIds];
            const expectedPermissionsCount = expectedPermissionsIds.length;

            const res = await agent.post(`/api/roles/${roleEntity.id}/permissions`).send(payload);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(expectedPermissionsCount);

            // check role entity
            const afterUpdateRoleEntity = await getRole({ id: roleEntity.id });

            expect(afterUpdateRoleEntity?.permissions).toHaveLength(expectedPermissionsCount);

            for (const permissionId of expectedPermissionsIds) {
                expect(afterUpdateRoleEntity?.permissions).toContainEqual(expect.objectContaining({ id: permissionId }));
            }
        });

        test('Add permissions fails if body is invalid', async () => {
            const agent = await createAuthenticatedAgent(server);
            const roleEntity = await createTestRole();

            const withoutBodyRes = await agent.post(`/api/roles/${roleEntity.id}/permissions`);
            expect(withoutBodyRes.statusCode).toEqual(400);

            const invalidBodyRes = await agent.post(`/api/roles/${roleEntity.id}/permissions`).send({ permissionsIds: 5 });
            expect(invalidBodyRes.statusCode).toBeGreaterThanOrEqual(400);

            const invalidIdsRes = await agent.post(`/api/roles/${roleEntity.id}/permissions`).send({ permissionsIds: [1, 2] });
            expect(invalidIdsRes.statusCode).toBeGreaterThanOrEqual(400);
        });

        test('Add permissions fails if any permission does\'nt exist', async () => {
            const agent = await createAuthenticatedAgent(server);
            const roleEntity = await createTestRole({ permissions: [] });

            const rolePermissionsCodes = ['read:users', 'delete:users'] as const;
            const permissions = await getPermissions([...rolePermissionsCodes]);
            const permissionsIds = permissions.map(p => p.id);

            const payload: RolePermissionsAddBody = {
                permissionsIds: [...permissionsIds, 'fakePermissionId']
            };

            const res1 = await agent.post(`/api/roles/${roleEntity.id}/permissions`).send(payload);

            expect(res1.statusCode).toEqual(422);

            const payload2: RolePermissionsAddBody = {
                permissionsIds: [...permissionsIds, fakeUUID]
            };

            const res2 = await agent.post(`/api/roles/${roleEntity.id}/permissions`).send(payload2);

            expect(res2.statusCode).toEqual(422);

            const afterUpdateRoleEntity = await getRole({ id: roleEntity.id });

            expect(afterUpdateRoleEntity?.permissions).toHaveLength(0);
        });

        test('Add permissions fails if role is root', async () => {
            const agent = await createAuthenticatedAgent(server);
            const rootRoleEntity = await getRootRole();
    
            const res = await agent.post(`/api/roles/${rootRoleEntity.id}/permissions`).send({ permissionsIds: [] });
    
            expect(res.statusCode).toEqual(405);
        });

        test('Add permissions fails if role doesn\'t exist', async () => {
            const agent = await createAuthenticatedAgent(server);
            const res = await agent.post('/api/roles/fakeRoleId/permissions').send({ permissionsIds: [] });
    
            expect(res.statusCode).toEqual(404);
    
            const res2 = await agent.post(`/api/roles/${fakeUUID}/permissions`).send({ permissionsIds: [] });
    
            expect(res2.statusCode).toEqual(404);
        });

        test('Add permissions fails if unauthenticated', async () => {
            const res = await request(server).post('/api/roles/fakeRoleId/permissions').send({ permissionsIds: [] });
    
            expect(res.statusCode).toEqual(401);
        });

        test('Add permissions fails if unauthorized', async () => {
            const noPermissionAgent = await createAuthenticatedAgent(server, {
                user: { username: 'noPermissionUser', email: 'noPermissionUser@gmail.com' },
                permissions: []
            });
    
            const noPermissionRes = await noPermissionAgent.post('/api/roles/fakeRoleId/permissions');
            expect(noPermissionRes.statusCode).toEqual(403);
    
            const lowPermissionAgent = await createAuthenticatedAgent(server, {
                user: { username: 'lowPermissionUser', email: 'lowPermissionUser@gmail.com' },
                permissions: ALL_PERMISSIONS.filter(permission => permission !== 'update:roles')
            });
            const lowPermissionRes = await lowPermissionAgent.post('/api/roles/fakeRoleId/permissions');
            expect(lowPermissionRes.statusCode).toEqual(403);
        });
    });

    describe('PUT /roles/:id/permissions', () => {
        beforeEach(async () => {
            await clearDatabase();
        });

        test('Update permissions', async () => {
            const agent = await createAuthenticatedAgent(server);
            const roleEntity = await createTestRole({ permissions: [] });

            // add
            const permissions = await getPermissions(['read:users', 'delete:users']);
            const permissionsIds = permissions.map(p => p.id);
            const permissionsCount = permissionsIds.length;

            const payload: RolePermissionsAddBody = {
                permissionsIds
            };

            const res = await agent.put(`/api/roles/${roleEntity.id}/permissions`).send(payload);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(permissionsCount);

            for (const permissionId of permissionsIds) {
                expect(res.body).toContainEqual(expect.objectContaining({ id: permissionId }));
            }

            const afterUpdateRoleEntity = await getRole({ id: roleEntity.id });

            expect(afterUpdateRoleEntity?.permissions).toHaveLength(permissionsCount);

            for (const permissionId of permissionsIds) {
                expect(afterUpdateRoleEntity?.permissions).toContainEqual(expect.objectContaining({ id: permissionId }));
            }

            // remove
            const removePayload: RolePermissionsAddBody = {
                permissionsIds: []
            };

            const removeRes = await agent.put(`/api/roles/${roleEntity.id}/permissions`).send(removePayload);

            expect(removeRes.statusCode).toEqual(200);
            expect(removeRes.body).toHaveLength(0);

            const afterRemovedPermissionsRoleEntity = await getRole({ id: roleEntity.id });

            expect(afterRemovedPermissionsRoleEntity?.permissions).toHaveLength(0);
        });

        test('Update permissions with duplicates', async () => {
            const agent = await createAuthenticatedAgent(server);
            const rolePermissionsCodes = ['read:users', 'delete:users'] as const;
            const permissions = await getPermissions([...rolePermissionsCodes]);
            const permissionsIds = permissions.map(p => p.id);
            const roleEntity = await createTestRole({ permissions: [...rolePermissionsCodes] });

            const permissionsToAdd = await getPermissions(['create:roles', 'read:roles']);
            const permissionsToAddIds = permissionsToAdd.map(p => p.id);

            const payload: RolePermissionsAddBody = {
                permissionsIds: [permissionsIds[0], permissionsIds[0], ...permissionsToAddIds]
            };

            const expectedPermissionsIds = [permissionsIds[0], ...permissionsToAddIds];
            const expectedPermissionsCount = expectedPermissionsIds.length;

            const res = await agent.put(`/api/roles/${roleEntity.id}/permissions`).send(payload);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(expectedPermissionsCount);

            // check role entity
            const afterUpdateRoleEntity = await getRole({ id: roleEntity.id });

            expect(afterUpdateRoleEntity?.permissions).toHaveLength(expectedPermissionsCount);

            for (const permissionId of expectedPermissionsIds) {
                expect(afterUpdateRoleEntity?.permissions).toContainEqual(expect.objectContaining({ id: permissionId }));
            }
        });

        test('Update permissions fails if body is invalid', async () => {
            const agent = await createAuthenticatedAgent(server);
            const roleEntity = await createTestRole();

            const withoutBodyRes = await agent.put(`/api/roles/${roleEntity.id}/permissions`);
            expect(withoutBodyRes.statusCode).toEqual(400);

            const invalidBodyRes = await agent.put(`/api/roles/${roleEntity.id}/permissions`).send({ permissionsIds: 5 });
            expect(invalidBodyRes.statusCode).toBeGreaterThanOrEqual(400);

            const invalidIdsRes = await agent.put(`/api/roles/${roleEntity.id}/permissions`).send({ permissionsIds: [1, 2] });
            expect(invalidIdsRes.statusCode).toBeGreaterThanOrEqual(400);
        });

        test('Update permissions fails if any permission does\'nt exist', async () => {
            const agent = await createAuthenticatedAgent(server);
            const roleEntity = await createTestRole({ permissions: [] });

            const rolePermissionsCodes = ['read:users', 'delete:users'] as const;
            const permissions = await getPermissions([...rolePermissionsCodes]);
            const permissionsIds = permissions.map(p => p.id);

            const payload: RolePermissionsAddBody = {
                permissionsIds: [...permissionsIds, 'fakePermissionId']
            };

            const res1 = await agent.put(`/api/roles/${roleEntity.id}/permissions`).send(payload);

            expect(res1.statusCode).toEqual(422);

            const payload2: RolePermissionsAddBody = {
                permissionsIds: [...permissionsIds, fakeUUID]
            };

            const res2 = await agent.put(`/api/roles/${roleEntity.id}/permissions`).send(payload2);

            expect(res2.statusCode).toEqual(422);

            const afterUpdateRoleEntity = await getRole({ id: roleEntity.id });

            expect(afterUpdateRoleEntity?.permissions).toHaveLength(0);
        });

        test('Update permissions fails if role is root', async () => {
            const agent = await createAuthenticatedAgent(server);
            const rootRoleEntity = await getRootRole();
    
            const res = await agent.put(`/api/roles/${rootRoleEntity.id}/permissions`).send({ permissionsIds: [] });
    
            expect(res.statusCode).toEqual(405);
        });

        test('Update permissions fails if role doesn\'t exist', async () => {
            const agent = await createAuthenticatedAgent(server);
            const res = await agent.put('/api/roles/fakeRoleId/permissions').send({ permissionsIds: [] });
    
            expect(res.statusCode).toEqual(404);
    
            const res2 = await agent.put(`/api/roles/${fakeUUID}/permissions`).send({ permissionsIds: [] });
    
            expect(res2.statusCode).toEqual(404);
        });

        test('Update permissions fails if unauthenticated', async () => {
            const res = await request(server).put('/api/roles/fakeRoleId/permissions').send({ permissionsIds: [] });
    
            expect(res.statusCode).toEqual(401);
        });

        test('Update permissions fails if unauthorized', async () => {
            const noPermissionAgent = await createAuthenticatedAgent(server, {
                user: { username: 'noPermissionUser', email: 'noPermissionUser@gmail.com' },
                permissions: []
            });
    
            const noPermissionRes = await noPermissionAgent.put('/api/roles/fakeRoleId/permissions');
            expect(noPermissionRes.statusCode).toEqual(403);
    
            const lowPermissionAgent = await createAuthenticatedAgent(server, {
                user: { username: 'lowPermissionUser', email: 'lowPermissionUser@gmail.com' },
                permissions: ALL_PERMISSIONS.filter(permission => permission !== 'update:roles')
            });
            const lowPermissionRes = await lowPermissionAgent.put('/api/roles/fakeRoleId/permissions');
            expect(lowPermissionRes.statusCode).toEqual(403);
        });
    });
});