import { MigrationInterface, QueryRunner } from 'typeorm';

type WithId<T> = T & Id;

interface Id {
    id: string;
}

interface Group<T = string> {
    code: T;
    description?: string;
}

interface Permission<T = string> {
    code: T;
    description?: string;
    groupId: string;
}

interface Role {
    id: string;
}

const GROUP_CODES = ['ROLES', 'USERS'] as const;
const PERMISSION_CODES = ['CREATE_USERS', 'READ_USERS', 'UPDATE_USERS', 'DELETE_USERS', 'CREATE_ROLES', 'READ_ROLES', 'UPDATE_ROLES', 'DELETE_ROLES'] as const;

type GroupCode = typeof GROUP_CODES[number];
type PermissionCode = typeof PERMISSION_CODES[number];

const GROUP_CODES_VALUES_QUERY = GROUP_CODES.map(code => `'${code}'`).join(',');
const PERMISSION_CODES_VALUES_QUERY = PERMISSION_CODES.map(code => `'${code}'`).join(',');

export class SeedPermissions1696964276870 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ADMIN ROLE
        await queryRunner.query(`INSERT INTO "role" (name) VALUES ('Admin')`);

        // GROUPS
        const groupsRecord: Record<GroupCode, Group> = {
            'ROLES': { code: 'ROLES', description: 'Gestion des rôles' },
            'USERS': { code: 'USERS', description: 'Gestion des utilisateurs' }
        }
        const groups = Object.entries(groupsRecord).map<Group>(([key, value]) => ({ ...value, code: key }));

        for (const group of groups) {
            await queryRunner.query(`INSERT INTO "permission_group" ("code", "description") VALUES ('${group.code}', '${group.description}')`);
        }

        const dbGroups: WithId<Group>[] = await queryRunner.query(`SELECT * FROM "permission_group" WHERE "code" IN (${GROUP_CODES_VALUES_QUERY})`)

        const rolesGroup = dbGroups.find(group => group.code === 'ROLES');
        const usersGroup = dbGroups.find(group => group.code === 'USERS');

        if (!rolesGroup || !usersGroup)
            throw 'Cannot find roles';

        // PERMISSIONS
        const permissionsRecord: Record<PermissionCode, Permission> = {
            'CREATE_USERS': { code: 'CREATE_USERS', description: 'Créer des utilisateurs', groupId: usersGroup.id },
            'READ_USERS': { code: 'READ_USERS', description: 'Voir les utilisateurs', groupId: usersGroup.id  },
            'UPDATE_USERS': { code: 'UPDATE_USERS', description: 'Modifier les utilisateurs', groupId: usersGroup.id },
            'DELETE_USERS': { code: 'DELETE_USERS', description: 'Supprimer des utilisateurs', groupId: usersGroup.id },
            'CREATE_ROLES': { code: 'CREATE_ROLES', description: 'Créer des rôles', groupId: rolesGroup.id },
            'READ_ROLES': { code: 'READ_ROLES', description: 'Voir les rôles', groupId: rolesGroup.id },
            'UPDATE_ROLES': { code: 'UPDATE_ROLES', description: 'Modifier/attribuer des rôles', groupId: rolesGroup.id },
            'DELETE_ROLES': { code: 'DELETE_ROLES', description: 'Supprimer des rôles', groupId: rolesGroup.id },
        };
        const permissions = Object.entries(permissionsRecord).map<Permission>(([key, value]) => ({ ...value, code: key }));

        for (const permission of permissions) {
            await queryRunner.query(`INSERT INTO "permission" ("code", "description", "groupId") VALUES ('${permission.code}', '${permission.description}', '${permission.groupId}')`);
        }

        const dbPermissions: WithId<Permission>[] = await queryRunner.query(`SELECT * FROM "permission" WHERE "code" IN (${PERMISSION_CODES_VALUES_QUERY})`);

        // ADMIN ROLE PERMISSIONS
        const [adminRole]: [Role] = await queryRunner.query(`SELECT "id" FROM "role" WHERE "name" = 'Admin'`);

        for (const permission of dbPermissions) {
            await queryRunner.query(`INSERT INTO "role_permissions_permission" ("roleId", "permissionId") VALUES ('${adminRole.id}', '${permission.id}')`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const dbPermissions: Pick<WithId<Permission>, 'id'>[] = await queryRunner.query(`SELECT "id" FROM "permission" WHERE "code" IN (${PERMISSION_CODES_VALUES_QUERY})`);
        const permissionsIdsValuesQuery = dbPermissions.map(permission => `'${permission.id}'`).join(',')

        // DELETE PERMISSIONS FROM ADMIN
        const [adminRole]: [Role] = await queryRunner.query(`SELECT "id" FROM "role" WHERE "name" = 'Admin'`);

        await queryRunner.query(`DELETE FROM "role_permissions_permission" WHERE "roleId" = '${adminRole.id}' AND "permissionId" IN (${permissionsIdsValuesQuery})`);

        // DELETE PERMISSIONS
        await queryRunner.query(`DELETE FROM "permission" WHERE "code" IN (${PERMISSION_CODES_VALUES_QUERY})`);

        // DELETE GROUPS
        await queryRunner.query(`DELETE FROM "permission_group" WHERE "code" IN (${GROUP_CODES_VALUES_QUERY})`);

        // DELETE ADMIN ROLE
        await queryRunner.query(`DELETE FROM "role" WHERE "name" = 'Admin'`);
    }

}
