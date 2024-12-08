import type { AnyPermission, UsersCreateBody } from '@internal/types';

import { AppDataSource } from '../../src/data-source';
import { UserEntity } from '../../src/entities/user';
import { createRole } from '../../src/services/roles';
import { createUserEntity } from '../../src/services/user';
import { createTestRole, getRootRole } from './roleHelpers';

export type UserProps = Partial<
    Omit<UsersCreateBody, 'roleId'>
>;

export interface TestUserProps {
    user?: UserProps;
    permissions?: AnyPermission[];
}

/**
 * Create a user in database.
 * @param testUser - User informations. Optional.
 * @returns 
 */
export const createTestUser = async ({ user, permissions }: TestUserProps = {}) => {
    const userRepo = AppDataSource.getRepository(UserEntity);
    const roleEntity = permissions ? await createTestRole({ name: user?.username && `${user.username}Role`, permissions }) : await getRootRole();

    const userEntity = createUserEntity({
        username: user?.username || 'testUser',
        email: user?.email || 'testUser@gmail.com',
        password: user?.password || 'password',
        role: createRole(roleEntity)
    });

    await userRepo.save(userEntity);

    return userEntity;
};
