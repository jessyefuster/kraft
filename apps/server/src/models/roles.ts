import type { Permission } from './permissions';

export interface Role {
    name: string;
    id?: string;
    description?: string;
    permissions?: Permission[];
}

export interface RoleWithPermission extends Role {
    permissions: Permission[];
}
