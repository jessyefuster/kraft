import type { PermissionDTO } from './permissions';

export interface RoleDTO {
    id: string;
    name: string;
    description?: string;
    permissions?: PermissionDTO[];
    permissionsCount?: number;
}

export interface RolesCreateBody {
    name: string;
    description?: string;
    permissionsIds?: Array<PermissionDTO['id']>;
}

export type RolesCreateResponse = RoleDTO;

export interface RolesDeleteParams {
    id: string;
}

export type RolesListResponse = Array<RoleDTO>;

export interface RoleGetParams {
    id: string;
}

export type RoleGetResponse = RoleDTO;

export interface RoleEditBody {
    name?: string;
    description?: string | null;
}

export type RoleEditResponse = RoleDTO;

export type RolePermissionsGetResponse = Array<PermissionDTO>;

export interface RolePermissionsUpdateBody {
    permissionsIds: Array<PermissionDTO['id']>;
}

export type RolePermissionsUpdateResponse = RolePermissionsGetResponse;

export type RolePermissionsAddBody = RolePermissionsUpdateBody;

export type RolePermissionsAddResponse = RolePermissionsGetResponse;
