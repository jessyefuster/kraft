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
