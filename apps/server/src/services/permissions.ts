import type { PermissionEntity } from '../entities/permission';
import { PermissionGroupMapper, PermissionMapper } from '../mappers/permissions';
import type { Permission, PermissionGroup } from '../models/permissions';

export const createPermissionGroupEntities = (permissionGroups: PermissionGroup[]) => {
    const mapper = new PermissionGroupMapper();

    return permissionGroups.map(permissionGroup => mapper.toEntity(permissionGroup));
};

export const createPermissionEntity = (permission: Permission) => {
    const groupMapper = new PermissionGroupMapper();
    const mapper = new PermissionMapper(groupMapper);

    return mapper.toEntity(permission);
};

export const createPermissionEntities = (permissions: Permission[]) => {
    const groupMapper = new PermissionGroupMapper();
    const mapper = new PermissionMapper(groupMapper);

    return permissions.map(permission => mapper.toEntity(permission));
};

export const createPermissions = (entities: PermissionEntity[]) => {
    const permissionGroupMapper = new PermissionGroupMapper();
    const mapper = new PermissionMapper(permissionGroupMapper);

    return entities.map(entity => mapper.fromEntity(entity));
};

export const createPermission = (entity: PermissionEntity) => {
    const permissionGroupMapper = new PermissionGroupMapper();
    const mapper = new PermissionMapper(permissionGroupMapper);

    return mapper.fromEntity(entity);
};
