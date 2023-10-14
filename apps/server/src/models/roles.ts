import type { Permission } from './permissions';

export interface Role {
    id: string;
    name: string;
    permissions?: Permission[];
}

export interface RoleWithPermission extends Role {
    permissions: Permission[];
}
