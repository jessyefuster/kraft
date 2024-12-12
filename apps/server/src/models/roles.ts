import type { Permission } from './permissions';
import type { User } from './users';

export interface Role {
    name: string;
    id?: string;
    description?: string;
    permissions?: Permission[];
    users?: User[];
}

export interface RoleWithPermission extends Role {
    permissions: Permission[];
}
