import type { Server } from 'http';
import request from 'supertest';

import { AppDataSource } from '../../src/data-source';
import { UserEntity } from '../../src/entities/user';
import { getDefaultRole } from '../utils/roleHelpers';
import { clearDatabase, closeDatabase, createAuthenticatedAgent, createTestServer } from '../utils/testsHelpers';
import { createTestUser } from '../utils/userHelpers';

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
        const defaultRole = await getDefaultRole();

        const username = 'fakeUser';
        const email = 'fakeUser@gmail.com';
        const password = 'fakeUserPwd';

        const res = await request(server).post('/api/users').send({ username, email, password, roleId: defaultRole.id });

        const userRepo = AppDataSource.getRepository(UserEntity);
        const user = await userRepo.findOneByOrFail({ username });

        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual(user.id);
    });

    test('User creation fails if query body is invalid', async () => {
        const defaultRole = await getDefaultRole();

        const username = 'fakeUser';
        const email = 'fakeUser@gmail.com';
        const password = 'fakeUserPwd';
        const roleId = defaultRole.id;

        // Missing username
        const withoutUsernameRes = await request(server).post('/api/users').send({ email, password, roleId });

        expect(withoutUsernameRes.statusCode).toEqual(400);

        // Missing email
        const withoutEmailRes = await request(server).post('/api/users').send({ username, password, roleId });

        expect(withoutEmailRes.statusCode).toEqual(400);

        // Missing password
        const withoutPasswordRes = await request(server).post('/api/users').send({ username, email, roleId });

        expect(withoutPasswordRes.statusCode).toEqual(400);

        // Missing role
        const withoutRoleRes = await request(server).post('/api/users').send({ username, email, password });

        expect(withoutRoleRes.statusCode).toEqual(400);

        // Username have less that 5 characters
        const invalidUsernameRes = await request(server).post('/api/users').send({ username: 'fake', email, password });

        expect(invalidUsernameRes.statusCode).toEqual(400);

        // Email is invalid
        const invalidEmailRes = await request(server).post('/api/users').send({ username, email: 'fake', password });

        expect(invalidEmailRes.statusCode).toEqual(400);

        // Password have less that 8 characters
        const invalidPasswordRes = await request(server).post('/api/users').send({ username, email, password: 'fake' });

        expect(invalidPasswordRes.statusCode).toEqual(400);

        // Inexistent role
        const invalidRoleRes = await request(server).post('/api/users').send({ username, email, password, roleId: 'fake' });

        expect(invalidRoleRes.statusCode).toEqual(422);
    });

    test('User creation fails if username or email already exists', async () => {
        const defaultRole = await getDefaultRole();
        const { username, email } = await createTestUser();

        // Username already existing
        const conclictingUsernameRes = await request(server).post('/api/users').send({ username, email: 'otherEmail@gmail.com', password: 'password', roleId: defaultRole.id });
        expect(conclictingUsernameRes.statusCode).toEqual(409);

        // Email already existing
        const conclictingEmailRes = await request(server).post('/api/users').send({ username: 'otherUsername', email, password: 'password', roleId: defaultRole.id });
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

        const user = await createTestUser({
            username: 'fakeUser',
            password: 'fakeUserPwd',
            email: 'fakeUser@gmail.com'
        });

        const res2 = await agent.get('/api/users');
        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toHaveLength(2);

        const userRepo = AppDataSource.getRepository(UserEntity);
        await userRepo.remove(user);

        const res3 = await agent.get('/api/users');
        expect(res3.statusCode).toEqual(200);
        expect(res3.body).toHaveLength(1);
    });

    test('User deletion fails if unauthenticated', async () => {
        const res = await request(server).delete('/api/users/fakeUserId');

        expect(res.statusCode).toEqual(401);
    });

    test('User deletion fails if user doesn\'t exist', async () => {
        const agent = await createAuthenticatedAgent(server);
        const res = await agent.delete('/api/users/fakeUserId');

        expect(res.statusCode).toEqual(404);
    });

    test('Delete a user', async () => {
        const userRepo = AppDataSource.getRepository(UserEntity);
        const agent = await createAuthenticatedAgent(server);
        
        await createTestUser({ username: 'fake1', password: 'password', email: 'fake1@gmail.com' });
        const userToDelete = await createTestUser({ username: 'fake2', password: 'password', email: 'fake2@gmail.com' });

        const usersCountBeforeDelete = await userRepo.count();
        
        const res = await agent.delete(`/api/users/${userToDelete.id}`);        
        expect(res.statusCode).toEqual(204);

        const repoUser = await userRepo.findOneBy({ id: userToDelete.id });
        const usersCountAfterDelete = await userRepo.count();
        expect(repoUser).toBeNull();
        expect(usersCountAfterDelete).toBe(usersCountBeforeDelete - 1);
    });
});