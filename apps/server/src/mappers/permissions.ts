import type { PermissionDTO, PermissionGroupDTO } from '@internal/types';

import { PermissionEntity } from '../entities/permission';
import { PermissionGroupEntity } from '../entities/permissionGroup';
import type { Mapper } from '../models/mappers';
import type { Permission, PermissionGroup } from '../models/permissions';

export class PermissionMapper implements Mapper<Permission> {
    constructor(
        private permissionGroupMapper: PermissionGroupMapper
    ) {}

    fromEntity(permissionEntity: PermissionEntity): Permission {
        return {
            id: permissionEntity.id,
            code: permissionEntity.code,
            description: permissionEntity.description || undefined,
            group: permissionEntity.group ? this.permissionGroupMapper.fromEntity(permissionEntity.group) : undefined
        };
    }

    toEntity(permission: Permission): PermissionEntity {
        const entity = new PermissionEntity();

        if (permission.id) {
            entity.id = permission.id;
        }

        if (permission.description) {
            entity.description = permission.description;
        }

        if (permission.group) {
            entity.group = this.permissionGroupMapper.toEntity(permission.group);
        }

        entity.code = permission.code;

        return entity;
    }

    toDTO(permission: Permission): PermissionDTO {
        return {
            id: permission.id || permission.code,
            code: permission.code,
            description: permission.description,
            group: permission.group && this.permissionGroupMapper.toDTO(permission.group)
        };
    }
}

export class PermissionGroupMapper implements Mapper<PermissionGroup> {
    fromEntity(permissionGroupEntity: PermissionGroupEntity): PermissionGroup {
        return {
            id: permissionGroupEntity.id,
            code: permissionGroupEntity.code,
            description: permissionGroupEntity.description || undefined
        };
    }

    toEntity(permissionGroup: PermissionGroup): PermissionGroupEntity {
        const entity = new PermissionGroupEntity();

        if (permissionGroup.id) {
            entity.id = permissionGroup.id;
        }

        if (permissionGroup.description) {
            entity.description = permissionGroup.description;
        }

        entity.code = permissionGroup.code;

        return entity;
    }

    toDTO(permissionGroup: PermissionGroup): PermissionGroupDTO {
        return {
            id: permissionGroup.id || permissionGroup.code,
            code: permissionGroup.code,
            description: permissionGroup.description
        };
    }
}
