import type { Server } from 'http';
import request from 'supertest';

import { AppDataSource } from '../../src/data-source';
import { UserEntity } from '../../src/entities/user';
import { ALL_PERMISSIONS } from '../../src/models/permissions';
import { getRootRole } from '../utils/roleHelpers';
import { clearDatabase, closeDatabase, createAuthenticatedAgent, createTestServer } from '../utils/testsHelpers';
import { createTestUser } from '../utils/userHelpers';
import { fakeUUID } from '../utils/uuid';

let server: Server;

beforeAll(async() => {
    server = await createTestServer();
});

afterAll(async () => {
    await closeDatabase();
    server.close();
});

describe('Users routes', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    test('Create a user', async () => {
        const agent = await createAuthenticatedAgent(server);

        const username = 'fakeUser';
        const email = 'fakeUser@gmail.com';
        const password = 'fakeUserPwd';

        const res = await agent.post('/api/users').send({ username, email, password });

        const userRepo = AppDataSource.getRepository(UserEntity);
        const user = await userRepo.findOneOrFail({ where: { username }, relations: { role: true } });

        expect(user.role).toBeNull();

        expect(res.statusCode).toEqual(201);
    });

    test('Create a user with a role', async () => {
        const agent = await createAuthenticatedAgent(server);
        const defaultRole = await getRootRole();

        const username = 'fakeUser';
        const email = 'fakeUser@gmail.com';
        const password = 'fakeUserPwd';

        const res = await agent.post('/api/users').send({ username, email, password, roleId: defaultRole.id });

        const userRepo = AppDataSource.getRepository(UserEntity);
        const user = await userRepo.findOneOrFail({ where: { username }, relations: { role: true } });

        expect(user.role).toBeDefined();
        expect(user.role!.id).toEqual(defaultRole.id);

        expect(res.statusCode).toEqual(201);
    });

    test('User creation fails if unauthenticated', async () =>  {
        const userPayload = {
            username: 'fakeUser',
            email: 'fakeUser@gmail.com'
        };

        const unauthenticatedRes = await request(server).post('/api/users').send(userPayload);
        expect(unauthenticatedRes.statusCode).toEqual(401);
    });

    test('User creation fails if unauthorized', async () =>  {
        const userPayload = {
            username: 'fakeUser',
            email: 'fakeUser@gmail.com'
        };

        const noPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'noPermissionUser', email: 'noPermissionUser@gmail.com' },
            permissions: []
        });

        const noPermissionRes = await noPermissionAgent.post('/api/users').send(userPayload);
        expect(noPermissionRes.statusCode).toEqual(403);

        const lowPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'lowPermissionUser', email: 'lowPermissionUser@gmail.com' },
            permissions: ALL_PERMISSIONS.filter(permission => permission !== 'create:users')
        });
        const lowPermissionRes = await lowPermissionAgent.post('/api/users').send(userPayload);
        expect(lowPermissionRes.statusCode).toEqual(403);
    });

    test('User creation fails if query body is invalid', async () => {
        const agent = await createAuthenticatedAgent(server);
        const defaultRole = await getRootRole();

        const username = 'fakeUser';
        const email = 'fakeUser@gmail.com';
        const password = 'fakeUserPwd';
        const roleId = defaultRole.id;

        // Missing username
        const withoutUsernameRes = await agent.post('/api/users').send({ email, password, roleId });

        expect(withoutUsernameRes.statusCode).toEqual(400);

        // Missing email
        const withoutEmailRes = await agent.post('/api/users').send({ username, password, roleId });

        expect(withoutEmailRes.statusCode).toEqual(400);

        // Missing password
        const withoutPasswordRes = await agent.post('/api/users').send({ username, email, roleId });

        expect(withoutPasswordRes.statusCode).toEqual(400);

        // Username have less that 5 characters
        const invalidUsernameRes = await agent.post('/api/users').send({ username: 'fake', email, password });

        expect(invalidUsernameRes.statusCode).toEqual(400);

        // Email is invalid
        const invalidEmailRes = await agent.post('/api/users').send({ username, email: 'fake', password });

        expect(invalidEmailRes.statusCode).toEqual(400);

        // Password have less that 8 characters
        const invalidPasswordRes = await agent.post('/api/users').send({ username, email, password: 'fake' });

        expect(invalidPasswordRes.statusCode).toEqual(400);

        // Inexistent role
        const invalidRoleRes = await agent.post('/api/users').send({ username, email, password, roleId: 'fake' });

        expect(invalidRoleRes.statusCode).toEqual(422);

        // Inexistent role
        const invalidRoleRes2 = await agent.post('/api/users').send({ username, email, password, roleId: fakeUUID });

        expect(invalidRoleRes2.statusCode).toEqual(422);
    });

    test('User creation fails if username or email already exists', async () => {
        const agent = await createAuthenticatedAgent(server);
        const defaultRole = await getRootRole();
        const { username, email } = await createTestUser({ user: { username: 'fakeUser', email: 'fakeEmail@gmail.com' } });

        // Username already existing
        const conclictingUsernameRes = await agent.post('/api/users').send({ username, email: 'otherEmail@gmail.com', password: 'password', roleId: defaultRole.id });
        expect(conclictingUsernameRes.statusCode).toEqual(409);

        // Email already existing
        const conclictingEmailRes = await agent.post('/api/users').send({ username: 'otherUsername', email, password: 'password', roleId: defaultRole.id });
        expect(conclictingEmailRes.statusCode).toEqual(409);
    });

    test('Throw an error if unauthenticated user tries to get users list', async () => {
        const res = await request(server).get('/api/users');

        expect(res.statusCode).toEqual(401);
    });

    test('Get users list', async () => {
        const agent = await createAuthenticatedAgent(server);

        const res1 = await agent.get('/api/users');
        expect(res1.statusCode).toEqual(200);
        expect(res1.body).toHaveLength(1);

        const user = await createTestUser({ user: { username: 'fakeUser', password: 'fakeUserPwd', email: 'fakeUser@gmail.com' } });

        const res2 = await agent.get('/api/users');
        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toHaveLength(2);

        const userRepo = AppDataSource.getRepository(UserEntity);
        await userRepo.remove(user);

        const res3 = await agent.get('/api/users');
        expect(res3.statusCode).toEqual(200);
        expect(res3.body).toHaveLength(1);
    });

    test('Get users role if sufficient permissions', async () => {
        const agent = await createAuthenticatedAgent(server);

        const adminRes = await agent.get('/api/users');
        expect(adminRes.statusCode).toEqual(200);
        expect(adminRes.body).toHaveLength(1);
        expect(adminRes.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ role: expect.anything() })
        ]));

        const lowPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'lowPermissionUser', email: 'lowPermissionUser@gmail.com' },
            permissions: ALL_PERMISSIONS.filter(permission => permission !== 'read:roles')
        });

        const lowPermissionRes = await lowPermissionAgent.get('/api/users');
        expect(lowPermissionRes.statusCode).toEqual(200);
        expect(lowPermissionRes.body).not.toContainEqual(expect.objectContaining({
            role: expect.anything()
        }));
    });

    test('Get users list fails if unauthenticated', async () => {
        const res = await request(server).get('/api/users');

        expect(res.statusCode).toEqual(401);
    });

    test('Get users list fails if unauthorized', async () => {
        const noPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'noPermissionUser', email: 'noPermissionUser@gmail.com' },
            permissions: []
        });

        const noPermissionRes = await noPermissionAgent.get('/api/users');
        expect(noPermissionRes.statusCode).toEqual(403);

        const lowPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'lowPermissionUser', email: 'lowPermissionUser@gmail.com' },
            permissions: ALL_PERMISSIONS.filter(permission => permission !== 'read:users')
        });
        const lowPermissionRes = await lowPermissionAgent.get('/api/users');
        expect(lowPermissionRes.statusCode).toEqual(403);
    });

    test('User deletion fails if unauthenticated', async () => {
        const res = await request(server).delete('/api/users/fakeUserId');

        expect(res.statusCode).toEqual(401);
    });

    test('User deletion fails if unauthorized', async () => {
        const noPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'noPermissionUser', email: 'noPermissionUser@gmail.com' },
            permissions: []
        });

        const noPermissionRes = await noPermissionAgent.delete('/api/users/fakeUserId');
        expect(noPermissionRes.statusCode).toEqual(403);

        const lowPermissionAgent = await createAuthenticatedAgent(server, {
            user: { username: 'lowPermissionUser', email: 'lowPermissionUser@gmail.com' },
            permissions: ALL_PERMISSIONS.filter(permission => permission !== 'delete:users')
        });
        const lowPermissionRes = await lowPermissionAgent.delete('/api/users/fakeUserId');
        expect(lowPermissionRes.statusCode).toEqual(403);
    });

    test('User deletion fails if user doesn\'t exist', async () => {
        const agent = await createAuthenticatedAgent(server);
        const res = await agent.delete('/api/users/fakeUserId');

        expect(res.statusCode).toEqual(404);

        const res2 = await agent.delete(`/api/users/${fakeUUID}`);

        expect(res2.statusCode).toEqual(404);
    });

    test('Delete a user', async () => {
        const userRepo = AppDataSource.getRepository(UserEntity);
        const agent = await createAuthenticatedAgent(server);
        
        await createTestUser({ user: { username: 'fake1', password: 'password', email: 'fake1@gmail.com' } });
        const userToDelete = await createTestUser({ user: { username: 'fake2', password: 'password', email: 'fake2@gmail.com' } });

        const usersCountBeforeDelete = await userRepo.count();
        
        const res = await agent.delete(`/api/users/${userToDelete.id}`);        
        expect(res.statusCode).toEqual(204);

        const repoUser = await userRepo.findOneBy({ id: userToDelete.id });
        const usersCountAfterDelete = await userRepo.count();
        expect(repoUser).toBeNull();
        expect(usersCountAfterDelete).toBe(usersCountBeforeDelete - 1);
    });
});