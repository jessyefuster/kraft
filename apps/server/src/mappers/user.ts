import type { UserDTO } from '@internal/types';

import { UserEntity } from '../entities/user';
import type { User } from '../models/users';
import { RoleMapper } from './roles';

export class UserMapper {
    static fromEntity(userEntity: UserEntity): User {
        return {
            id: userEntity.id,
            createdAt: userEntity.createdAt,
            updatedAt: userEntity.updatedAt,
            email: userEntity.email,
            username: userEntity.username,
            deletedAt: userEntity.deletedAt ?? undefined,
            role: userEntity.role ? RoleMapper.fromEntity(userEntity.role) : undefined
        };
    }

    static toEntity(user: User): UserEntity {
        const entity = new UserEntity();

        if (user.id) {
            entity.id = user.id;
        }

        if (user.password) {
            entity.password = user.password;
        }

        if (user.role) {
            entity.role = RoleMapper.toEntity(user.role);
        }

        entity.email = user.email;
        entity.username = user.username;

        return entity;
    }

    static toDTO(user: User): UserDTO {
        return {
            id: user.id || user.email,
            createdAt: user.createdAt?.toISOString(),
            email: user.email,
            username: user.username,
            role: user.role && RoleMapper.toDTO(user.role)
        };
    }
}
