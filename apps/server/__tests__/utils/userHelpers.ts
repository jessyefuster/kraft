import type { AnyPermission, UsersCreateBody } from '@internal/types';

import { AppDataSource } from '../../src/data-source';
import { UserEntity } from '../../src/entities/user';
import { createRole } from '../../src/services/roles';
import { createUserEntity } from '../../src/services/user';
import { createTestRole, getRole, getRootRole } from './roleHelpers';

export type UserProps = Partial<
    Omit<UsersCreateBody, 'roleId'>
>;

export interface TestUserProps {
    user?: UserProps;
    permissions?: AnyPermission[];
    roleName?: string;
}

/**
 * Create a user in database.
 * @param testUser - User informations. Optional.
 * @returns 
 */
export const createTestUser = async ({ user, permissions, roleName }: TestUserProps = {}) => {
    const userRepo = AppDataSource.getRepository(UserEntity);
    const roleEntity = permissions
        ? await createTestRole({ name: roleName || `${user?.username || 'testUser'})Role`, permissions })
        : (roleName ? await getRole({ name: roleName }) : await getRootRole() );

    const userEntity = createUserEntity({
        username: user?.username || 'testUser',
        email: user?.email || 'testUser@gmail.com',
        password: user?.password || 'password',
        role: roleEntity ? createRole(roleEntity) : undefined
    });

    await userRepo.save(userEntity);

    return userEntity;
};

export const getUserByUsername = async (username: string) => {
    const roleRepo = AppDataSource.getRepository(UserEntity);

    return await roleRepo.findOne({ where: { username }, relations: { role: true } });
};
