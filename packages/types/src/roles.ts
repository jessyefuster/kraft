import type { PermissionDTO } from './permissions';
import type { UserDTO } from './users';

export interface RoleDTO {
    id: string;
    name: string;
    description?: string;
    permissions?: PermissionDTO[];
    permissionsCount?: number;
    users?: UserDTO[];
    usersCount?: number;
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

export interface RoleUsersAddBody {
    usersIds: Array<UserDTO['id']>;
}

export type RoleUsersAddResponse = Array<UserDTO>;

export interface RoleUsersDeleteBody {
    usersIds: Array<UserDTO['id']>;
}

export type RoleUsersDeleteResponse = Array<UserDTO>;
