import type { Server } from 'http';
import request from 'supertest';

import { AppDataSource } from '../../src/data-source';
import { RoleEntity } from '../../src/entities/role';
import { createTestRole } from '../utils/roleHelpers';
import { clearDatabase, closeDatabase, createAuthenticatedAgent, createTestServer } from '../utils/testsHelpers';
import { ALL_PERMISSIONS } from '../../src/models/permissions';

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

});