import type { AnyPermission } from '@internal/types';

export interface PermissionGroup {
    code: string;
    permissions?: Permission[];
    id?: string;
    description?: string;
}

export interface Permission {
    code: AnyPermission;
    id?: string;
    description?: string;
    group?: PermissionGroup;
}
