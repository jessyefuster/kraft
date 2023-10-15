import type { UserDTO } from '@internal/types';

import { UserEntity } from '../entities/user';
import type { Mapper } from '../models/mappers';
import type { User } from '../models/users';
import type { RoleMapper } from './roles';

export class UserMapper implements Mapper<User> {
    constructor(
        private roleMapper: RoleMapper
    ) {}

    fromEntity(userEntity: UserEntity): User {
        return {
            id: userEntity.id,
            createdAt: userEntity.createdAt,
            updatedAt: userEntity.updatedAt,
            email: userEntity.email,
            username: userEntity.username,
            deletedAt: userEntity.deletedAt ?? undefined,
            role: userEntity.role && this.roleMapper.fromEntity(userEntity.role)
        };
    }

    toEntity(user: User): UserEntity {
        const entity = new UserEntity();

        if (user.id) {
            entity.id = user.id;
        }

        if (user.password) {
            entity.password = user.password;
        }

        if (user.role) {
            entity.role = this.roleMapper.toEntity(user.role);
        }

        entity.email = user.email;
        entity.username = user.username;

        return entity;
    }

    toDTO(user: User): UserDTO {
        return {
            id: user.id || user.email,
            createdAt: user.createdAt?.toISOString(),
            email: user.email,
            username: user.username,
            role: user.role && this.roleMapper.toDTO(user.role)
        };
    }
}
