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
const PERMISSION_CODES = ['create:users', 'read:users', 'update:users', 'delete:users', 'create:roles', 'read:roles', 'update:roles', 'delete:roles'] as const;

type GroupCode = typeof GROUP_CODES[number];
type PermissionCode = typeof PERMISSION_CODES[number];

const GROUP_CODES_VALUES_QUERY = GROUP_CODES.map(code => `'${code}'`).join(',');
const PERMISSION_CODES_VALUES_QUERY = PERMISSION_CODES.map(code => `'${code}'`).join(',');

export class SeedPermissions1697371114357 implements MigrationInterface {
    name = 'SeedPermissions1697371114357';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ADMIN ROLE
        await queryRunner.query(`INSERT INTO "role" ("name", "description", "isRoot") VALUES ('Admin', 'Rôle de base, non modifiable', true)`);

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
            'create:users': { code: 'create:users', description: 'Créer des utilisateurs', groupId: usersGroup.id },
            'read:users': { code: 'read:users', description: 'Voir les utilisateurs', groupId: usersGroup.id  },
            'update:users': { code: 'update:users', description: 'Modifier les utilisateurs', groupId: usersGroup.id },
            'delete:users': { code: 'delete:users', description: 'Supprimer des utilisateurs', groupId: usersGroup.id },
            'create:roles': { code: 'create:roles', description: 'Créer des rôles', groupId: rolesGroup.id },
            'read:roles': { code: 'read:roles', description: 'Voir les rôles', groupId: rolesGroup.id },
            'update:roles': { code: 'update:roles', description: 'Modifier/attribuer des rôles', groupId: rolesGroup.id },
            'delete:roles': { code: 'delete:roles', description: 'Supprimer des rôles', groupId: rolesGroup.id },
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
        // DELETE PERMISSIONS
        await queryRunner.query(`DELETE FROM "permission" WHERE "code" IN (${PERMISSION_CODES_VALUES_QUERY})`);

        // DELETE GROUPS
        await queryRunner.query(`DELETE FROM "permission_group" WHERE "code" IN (${GROUP_CODES_VALUES_QUERY})`);

        // DELETE ADMIN ROLE
        await queryRunner.query(`DELETE FROM "role" WHERE "name" = 'Admin'`);
    }

}
