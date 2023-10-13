import { AppDataSource } from '../../src/data-source';
import { UserEntity } from '../../src/entities/user';
import { createRole } from '../../src/services/roles';
import { createUserEntity } from '../../src/services/user';
import { getDefaultRole } from './roleHelpers';

export interface TestUserProps {
    username?: string;
    email?: string;
    password?: string;
}

/**
 * Create a user in database.
 * @param testUser - User informations. Optional.
 * @returns 
 */
export const createTestUser = async (testUser?: TestUserProps) => {
    const userRepo = AppDataSource.getRepository(UserEntity);

    const user = createUserEntity({
        username: testUser?.username || 'testUser',
        email: testUser?.email || 'testUser@gmail.com',
        password: testUser?.password || 'password',
        role: createRole(await getDefaultRole())
    });

    await userRepo.save(user);

    return user;
};
