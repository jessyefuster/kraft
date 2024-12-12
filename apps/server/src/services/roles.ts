import type { AnyPermission } from '@internal/types';

import type { RoleEntity } from '../entities/role';
import { RoleMapper } from '../mappers/roles';
import type { Role } from '../models/roles';

export const createRoleEntity = (role: Role) =>
    RoleMapper.toEntity(role);

export const createRole = (roleEntity: RoleEntity) =>
    RoleMapper.fromEntity(roleEntity);

export const createRoles = (roleEntities: RoleEntity[]) =>
    roleEntities.map(entity => createRole(entity));

export const createRoleDTO = (role: Role) =>
    RoleMapper.toDTO(role);

export const createRolesDTO = (roles: Role[]) =>
    roles.map(role => RoleMapper.toDTO(role));

export const createRoleDTOFromEntity = (roleEntity: RoleEntity) => {
    const role = RoleMapper.fromEntity(roleEntity);
    const roleDTO = RoleMapper.toDTO(role);

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
