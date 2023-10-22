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

export const createRoles = (roleEntities: RoleEntity[]) => {
    const permissionGroupMapper = new PermissionGroupMapper();
    const permissionMapper = new PermissionMapper(permissionGroupMapper);
    const mapper = new RoleMapper(permissionMapper);

    return roleEntities.map(entity => mapper.fromEntity(entity));
};

export const createRoleDTO = (role: Role) => {
    const permissionGroupMapper = new PermissionGroupMapper();
    const permissionMapper = new PermissionMapper(permissionGroupMapper);
    const mapper = new RoleMapper(permissionMapper);

    return mapper.toDTO(role);
};

export const createRolesDTO = (roles: Role[]) => {
    const permissionGroupMapper = new PermissionGroupMapper();
    const permissionMapper = new PermissionMapper(permissionGroupMapper);
    const mapper = new RoleMapper(permissionMapper);

    return roles.map(role => mapper.toDTO(role));
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

export const mapRolesForRolesList = (roles: Role[]) => {
    const rolesList = createRolesDTO(roles);

    return rolesList.sort((a, b) => {
        const aPermissionsCount = a.permissionsCount ?? 0;
        const bPermissionsCount = b.permissionsCount ?? 0;

        return bPermissionsCount - aPermissionsCount;
    });
};
