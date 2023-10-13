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

export const USERS_PERMISSIONS = ['CREATE_USERS', 'READ_USERS','UPDATE_USERS', 'DELETE_USERS'] as const;
export const ROLES_PERMISSIONS = ['CREATE_ROLES', 'READ_ROLES','UPDATE_ROLES', 'DELETE_ROLES'] as const;
export const ALL_PERMISSIONS = [...USERS_PERMISSIONS, ...ROLES_PERMISSIONS] as const;

export type UsersPermission = typeof USERS_PERMISSIONS[number];
export type RolesPermission = typeof ROLES_PERMISSIONS[number];
export type AnyPermission = typeof ALL_PERMISSIONS[number];
