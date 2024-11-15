export interface PermissionGroupDTO {
    id: string;
    code: string;
    permissions?: PermissionDTO[];
    description?: string;
}

export interface PermissionDTO {
    id: string;
    code: string;
    description?: string;
    group?: PermissionGroupDTO;
}

export type PermissionsListResponse = Array<PermissionDTO>;
