import type { Role } from './roles';

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
