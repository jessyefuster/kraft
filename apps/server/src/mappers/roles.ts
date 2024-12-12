import type { RoleDTO } from '@internal/types';

import { RoleEntity } from '../entities/role';
import type { Role } from '../models/roles';
import { PermissionMapper } from './permissions';
import { UserMapper } from './user';

export class RoleMapper {
    static fromEntity(roleEntity: RoleEntity): Role {
        return {
            id: roleEntity.id,
            name: roleEntity.name,
            description: roleEntity.description ?? undefined,
            permissions: roleEntity.permissions?.map(entity => PermissionMapper.fromEntity(entity)),
            users: roleEntity.users?.map(entity => UserMapper.fromEntity(entity)),
        };
    }

    static toEntity(role: Role): RoleEntity {
        const entity = new RoleEntity();

        if (role.id) {
            entity.id = role.id;
        }
        if (role.description) {
            entity.description = role.description;
        }

        entity.name = role.name;
        entity.permissions = role.permissions?.map(permission => PermissionMapper.toEntity(permission));

        return entity;
    }

    static toDTO(role: Role): RoleDTO {
        return {
            id: role.id || role.name,
            name: role.name,
            description: role.description,
            permissions: role.permissions?.map(permission => PermissionMapper.toDTO(permission)),
            permissionsCount: role.permissions?.length ?? undefined,
            users: role.users?.map(user => UserMapper.toDTO(user)),
            usersCount: role.users?.length ?? undefined
        };
    }
}