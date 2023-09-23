import { UserDTO } from './users';

export interface AuthLoginBody {
    login: string;
    password: string;
}

export type AuthLoginResponse = Omit<UserDTO, 'createdAt'>;
