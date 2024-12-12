import type { AnyPermission } from '@internal/types';

import type { UserEntity } from '../entities/user';
import { UserMapper } from '../mappers/user';
import type { User } from '../models/users';
import { roleHasPermissions } from './roles';

export const createUser = (userEntity: UserEntity) =>
    UserMapper.fromEntity(userEntity);

export const createUsers = (userEntities: UserEntity[]) =>
    userEntities.map(entity => createUser(entity));

export const createUserEntity = (user: User) =>
    UserMapper.toEntity(user);

export const createUserDTO = (user: User) =>
    UserMapper.toDTO(user);

export const createUserDTOFromEntity = (userEntity: UserEntity) => {
    const user = createUser(userEntity);
    const userDTO = createUserDTO(user);

    return userDTO;
};

export const userHasPermissions = (user: User, permissions: AnyPermission[]) => {
    const userRole = user.role;

    return userRole && roleHasPermissions(userRole, permissions);
};
