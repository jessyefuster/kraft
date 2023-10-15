import type { RoleDTO } from '@internal/types';

import { RoleEntity } from '../entities/role';
import type { Mapper } from '../models/mappers';
import type { Role } from '../models/roles';
import type { PermissionMapper } from './permissions';

export class RoleMapper implements Mapper<Role> {
    constructor(
        private permissionMapper: PermissionMapper
    ) {}

    fromEntity(roleEntity: RoleEntity): Role {
        return {
            id: roleEntity.id,
            name: roleEntity.name,
            description: roleEntity.description ?? undefined,
            permissions: roleEntity.permissions?.map(entity => this.permissionMapper.fromEntity(entity))
        };
    }

    toEntity(role: Role): RoleEntity {
        const entity = new RoleEntity();

        if (role.id) {
            entity.id = role.id;
        }

        entity.name = role.name;
        entity.permissions = role.permissions?.map(permission => this.permissionMapper.toEntity(permission));

        return entity;
    }

    toDTO(role: Role): RoleDTO {
        return {
            id: role.id || role.name,
            name: role.name,
            description: role.description,
            permissions: role.permissions?.map(permission => this.permissionMapper.toDTO(permission))
        };
    }
}