import type { Server } from 'http';
import request from 'supertest';
import { ALL_PERMISSIONS } from '@internal/types';

import { clearDatabase, closeDatabase, createAuthenticatedAgent, createTestServer } from '../utils/testsHelpers';
import { getPermissions } from '../utils/roleHelpers';

let server: Server;

beforeAll(async() => {
    server = await createTestServer();
});

afterAll(async () => {
    await closeDatabase();
    server.close();
});

describe('Permissions routes', () => {

    describe('GET /permissions', () => {
        beforeEach(async () => {
            await clearDatabase();
        });

        test('Get permissions list', async () => {
            const agent = await createAuthenticatedAgent(server);
            const permissionsEntities = await getPermissions();

            const res = await agent.get('/api/permissions');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(permissionsEntities.length);
        });

        test('Get permissions list fails if unauthenticated', async () => {
            const res = await request(server).get('/api/permissions');
    
            expect(res.statusCode).toEqual(401);
        });

        test('Get permissions list fails if unauthorized', async () => {
            const noPermissionAgent = await createAuthenticatedAgent(server, {
                user: { username: 'noPermissionUser', email: 'noPermissionUser@gmail.com' },
                permissions: []
            });
    
            const noPermissionRes = await noPermissionAgent.get('/api/permissions');
            expect(noPermissionRes.statusCode).toEqual(403);
    
            const lowPermissionAgent = await createAuthenticatedAgent(server, {
                user: { username: 'lowPermissionUser', email: 'lowPermissionUser@gmail.com' },
                permissions: ALL_PERMISSIONS.filter(permission => permission !== 'read:roles')
            });
            const lowPermissionRes = await lowPermissionAgent.get('/api/permissions');
            expect(lowPermissionRes.statusCode).toEqual(403);
        });
    });

});