import type { Role, RoleWithPermission } from './roles';

export interface User {
    id?: string;
    createdAt?: Date;
    deletedAt?: Date;
    updatedAt?: Date;
    username: string;
    email: string;
    role?: Role;
    password?: string;
}

export interface UserWithRole extends User {
    role: RoleWithPermission;
}
