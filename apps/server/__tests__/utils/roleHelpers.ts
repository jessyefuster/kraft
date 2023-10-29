import type { RolesCreateBody } from '@internal/types';
import { In } from 'typeorm';

import { AppDataSource } from '../../src/data-source';
import { PermissionEntity } from '../../src/entities/permission';
import { RoleEntity } from '../../src/entities/role';
import type { AnyPermission } from '../../src/models/permissions';
import { createRoleEntity } from '../../src/services/roles';
import { createPermissions } from '../../src/services/permissions';

const DEFAULT_ROLE_NAME = 'testRole';

export type TestRoleProps = Partial<
    Omit<RolesCreateBody, 'permissionsIds'> & {
        permissions: AnyPermission[];
    }
>;

export const getPermissions = async (codes: AnyPermission[]) => {
    const permissionsRepo = AppDataSource.getRepository(PermissionEntity);
    const permissionEntities = await permissionsRepo.findBy({ code: In(codes) });

    return permissionEntities;
};

/**
 * Create a role in database.
 * @param testRole - Role informations. Optional.
 * @returns 
 */
export const createTestRole = async (testRole?: TestRoleProps, isRoot: boolean = false) => {
    const permissions = testRole?.permissions || [];
    const roleRepo = AppDataSource.getRepository(RoleEntity);

    const roleEntity = createRoleEntity({
        name: testRole?.name || DEFAULT_ROLE_NAME,
        permissions: permissions.length ? createPermissions(await getPermissions(permissions)) : undefined,
    });

    roleEntity.isRoot = isRoot;

    await roleRepo.save(roleEntity);

    return roleEntity;
};

export const getRole = async ({ name, id }: { name?: string; id?: string }) => {
    const roleRepo = AppDataSource.getRepository(RoleEntity);

    return await roleRepo.findOne({ where: { name, id }, relations: { permissions: true } });
};

export const getRootRole = async () => {
    const roleRepo = AppDataSource.getRepository(RoleEntity);

    const rootRole = await roleRepo.findOneBy({ isRoot: true }) as RoleEntity;

    return rootRole;
};
