import type { AnyPermission } from '@internal/types';

import type { UserEntity } from '../entities/user';
import { PermissionGroupMapper, PermissionMapper } from '../mappers/permissions';
import { RoleMapper } from '../mappers/roles';
import { UserMapper } from '../mappers/user';
import type { User } from '../models/users';
import { roleHasPermissions } from './roles';

export const createUserEntity = (user: User) => {
    const permissionGroupMapper = new PermissionGroupMapper();
    const permissionMapper = new PermissionMapper(permissionGroupMapper);
    const roleMapper = new RoleMapper(permissionMapper);
    const mapper = new UserMapper(roleMapper);

    return mapper.toEntity(user);
};

export const createUserDTO = (user: User) => {
    const permissionGroupMapper = new PermissionGroupMapper();
    const permissionMapper = new PermissionMapper(permissionGroupMapper);
    const roleMapper = new RoleMapper(permissionMapper);
    const mapper = new UserMapper(roleMapper);

    return mapper.toDTO(user);
};

export const createUserDTOFromEntity = (userEntity: UserEntity) => {
    const permissionGroupMapper = new PermissionGroupMapper();
    const permissionMapper = new PermissionMapper(permissionGroupMapper);
    const roleMapper = new RoleMapper(permissionMapper);
    const mapper = new UserMapper(roleMapper);

    const user = mapper.fromEntity(userEntity);
    const userDTO = mapper.toDTO(user);

    return userDTO;
};

export const userHasPermissions = (user: User, permissions: AnyPermission[]) => {
    const userRole = user.role;

    return userRole && roleHasPermissions(userRole, permissions);
};
