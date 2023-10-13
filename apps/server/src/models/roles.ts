import type { Permission } from './permissions';

export interface Role {
    id: string;
    name: string;
    permissions?: Permission[];
}
