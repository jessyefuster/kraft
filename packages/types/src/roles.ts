import type { PermissionDTO } from './permissions';

export interface RoleDTO {
    id: string;
    name: string;
    permissions?: PermissionDTO[];
}

export type RolesListResponse = Array<RoleDTO>;
