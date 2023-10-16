import type { RoleEntity } from '../entities/role';
import { PermissionGroupMapper, PermissionMapper } from '../mappers/permissions';
import { RoleMapper } from '../mappers/roles';
import type { AnyPermission } from '../models/permissions';
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

export const createRoleDTOFromEntity = (roleEntity: RoleEntity) => {
    const permissionGroupMapper = new PermissionGroupMapper();
    const permissionMapper = new PermissionMapper(permissionGroupMapper);
    const mapper = new RoleMapper(permissionMapper);

    const role = mapper.fromEntity(roleEntity);
    const roleDTO = mapper.toDTO(role);

    return roleDTO;
};

export const roleHasPermissions = (role: Role, permissions: AnyPermission[]) => {
    const rolePermissions = role.permissions || [];

    return permissions.every(permission => 
        rolePermissions.find(rolePermission => rolePermission.code === permission)
    );
};
