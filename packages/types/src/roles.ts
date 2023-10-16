import type { PermissionDTO } from './permissions';

export interface RoleDTO {
    id: string;
    name: string;
    description?: string;
    permissions?: PermissionDTO[];
}

export interface RolesCreateBody {
    name: string;
    description?: string;
    permissionsIds?: Array<PermissionDTO['id']>;
}

export interface RolesDeleteParams {
    id: string;
}

export type RolesListResponse = Array<RoleDTO>;
