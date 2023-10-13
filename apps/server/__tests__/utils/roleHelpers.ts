import { AppDataSource } from '../../src/data-source';
import { RoleEntity } from '../../src/entities/role';

export const DEFAULT_ROLE_NAME = 'testRole';

export interface TestRoleProps {
    name?: string;
}

/**
 * Create a role in database.
 * @param testRole - Role informations. Optional.
 * @returns 
 */
export const createTestRole = async (testRole?: TestRoleProps) => {
    const roleRepo = AppDataSource.getRepository(RoleEntity);

    const role = new RoleEntity();
    role.name = testRole?.name || DEFAULT_ROLE_NAME;

    await roleRepo.save(role);

    return role;
};

export const getDefaultRole = async () => {
    const roleRepo = AppDataSource.getRepository(RoleEntity);

    const defaultRole = await roleRepo.findOneBy({ name: DEFAULT_ROLE_NAME });

    return defaultRole || await createTestRole();
};
