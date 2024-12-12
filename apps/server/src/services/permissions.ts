import type { PermissionEntity } from '../entities/permission';
import { PermissionGroupMapper, PermissionMapper } from '../mappers/permissions';
import type { Permission, PermissionGroup } from '../models/permissions';

export const createPermissionGroupEntities = (permissionGroups: PermissionGroup[]) =>
    permissionGroups.map(permissionGroup => PermissionGroupMapper.toEntity(permissionGroup));

export const createPermissionEntity = (permission: Permission) =>
    PermissionMapper.toEntity(permission);

export const createPermissionEntities = (permissions: Permission[]) =>
    permissions.map(permission => PermissionMapper.toEntity(permission));

export const createPermissions = (entities: PermissionEntity[]) =>
    entities.map(entity => PermissionMapper.fromEntity(entity));

export const createPermission = (entity: PermissionEntity) =>
    PermissionMapper.fromEntity(entity);

export const createPermissionDTO = (permission: Permission) =>
    PermissionMapper.toDTO(permission);

export const createPermissionsDTO = (permissions: Permission[]) =>
    permissions.map(permission => PermissionMapper.toDTO(permission));
