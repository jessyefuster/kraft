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

export const USERS_PERMISSIONS = ['create:users', 'read:users','update:users', 'delete:users'] as const;
export const ROLES_PERMISSIONS = ['create:roles', 'read:roles','update:roles', 'delete:roles'] as const;
export const ALL_PERMISSIONS = [...USERS_PERMISSIONS, ...ROLES_PERMISSIONS] as const;

export type UsersPermission = typeof USERS_PERMISSIONS[number];
export type RolesPermission = typeof ROLES_PERMISSIONS[number];
export type AnyPermission = typeof ALL_PERMISSIONS[number];
