import type { PermissionDTO, PermissionGroupDTO } from '@internal/types';

import { PermissionEntity } from '../entities/permission';
import { PermissionGroupEntity } from '../entities/permissionGroup';
import type { Permission, PermissionGroup } from '../models/permissions';

export class PermissionMapper {
    static fromEntity(permissionEntity: PermissionEntity): Permission {
        return {
            id: permissionEntity.id,
            code: permissionEntity.code,
            description: permissionEntity.description ?? undefined,
            group: permissionEntity.group ? PermissionGroupMapper.fromEntity(permissionEntity.group) : undefined
        };
    }

    static toEntity(permission: Permission): PermissionEntity {
        const entity = new PermissionEntity();

        if (permission.id) {
            entity.id = permission.id;
        }

        if (permission.description) {
            entity.description = permission.description;
        }

        if (permission.group) {
            entity.group = PermissionGroupMapper.toEntity(permission.group);
        }

        entity.code = permission.code;

        return entity;
    }

    static toDTO(permission: Permission): PermissionDTO {
        return {
            id: permission.id || permission.code,
            code: permission.code,
            description: permission.description,
            group: permission.group && PermissionGroupMapper.toDTO(permission.group)
        };
    }
}

export class PermissionGroupMapper {
    static fromEntity(permissionGroupEntity: PermissionGroupEntity): PermissionGroup {
        return {
            id: permissionGroupEntity.id,
            code: permissionGroupEntity.code,
            description: permissionGroupEntity.description ?? undefined
        };
    }

    static toEntity(permissionGroup: PermissionGroup): PermissionGroupEntity {
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

    static toDTO(permissionGroup: PermissionGroup): PermissionGroupDTO {
        return {
            id: permissionGroup.id || permissionGroup.code,
            code: permissionGroup.code,
            description: permissionGroup.description
        };
    }
}
