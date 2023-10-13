import type { RoleEntity } from '../entities/role';
import { PermissionGroupMapper, PermissionMapper } from '../mappers/permissions';
import { RoleMapper } from '../mappers/roles';
import type { Role } from '../models/roles';

export const createRoleEntity = (role: Role) => {
    const permissionGroupMapper = new PermissionGroupMapper();
    const permissionMapper = new PermissionMapper(permissionGroupMapper);
    const mapper = new RoleMapper(permissionMapper);

    return mapper.toEntity(role);
};

export const createRole = (roleEntity: RoleEntity) => {
    const permissionGroupMapper = new PermissionGroupMapper();
    const permissionMapper = new PermissionMapper(permissionGroupMapper);
    const mapper = new RoleMapper(permissionMapper);

    return mapper.fromEntity(roleEntity);
};
