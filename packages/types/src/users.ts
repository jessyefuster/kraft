export interface UserDTO {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
}

export interface UsersCreateBody {
  username: string;
  email: string;
  password: string;
}

export interface UsersDeleteParams {
  id: string;
}

export type UsersListResponse = Array<UserDTO>;
