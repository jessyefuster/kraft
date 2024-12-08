import type { RoleDTO } from './roles';

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
  role?: RoleDTO;
}

export interface UsersCreateBody {
  username: string;
  email: string;
  password: string;
  roleId?: string;
}

export type UsersCreateResponse = UserDTO;

export interface UsersDeleteParams {
  id: string;
}

export type UsersListResponse = Array<UserDTO>;

export type UsersMeResponse = UserDTO;
