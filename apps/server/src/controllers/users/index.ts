import type { Request, Response } from 'express';
import createHttpError from 'http-errors';
import type { UsersCreateBody, UsersListResponse } from '@internal/types';

import { AppDataSource } from '../../data-source';
import { RoleEntity } from '../../entities/role';
import { UserEntity } from '../../entities/user';
import { createRole } from '../../services/roles';
import { createUserDTOFromEntity, createUserEntity } from '../../services/user';
import { validateCreateBody, validateDeleteParams } from './validators';

const create = async (req: TypedRequestBody<UsersCreateBody>, res: Response) => {
    const { username, email, password, roleId } = validateCreateBody(req.body);

    // Create a query runner to control the transactions, it allows to cancel the transaction if we need to
    const queryRunner = AppDataSource.createQueryRunner();

    // Connect the query runner to the database and start the transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const userRepo = queryRunner.manager.getRepository(UserEntity);
        const usernameExists = await userRepo.exist({
            where: { username }
        });
        if (usernameExists) {
            throw createHttpError(409, 'Username already exists');
        }

        const emailExists = await userRepo.exist({
            where: { email }
        });
        if (emailExists) {
            throw createHttpError(409, 'Email already exists');
        }

        const roleRepo = queryRunner.manager.getRepository(RoleEntity);
        const roleEntity = await roleRepo.findOneBy({ id: roleId });
        if (!roleEntity) {
            throw createHttpError(422, 'Cannot find role');
        }

        const role = createRole(roleEntity);

        const newUser = createUserEntity({
            username,
            email,
            password,
            role
        });

        await queryRunner.manager.save(newUser);

        // No exceptions occured, so we commit the transaction
        await queryRunner.commitTransaction();

        res.send(newUser.id);
    } catch (err) {
        // As an exception occured, cancel the transaction
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        // We need to release the query runner to not keep a useless connection to the database
        await queryRunner.release();
    }
};

const getAll = async (req: Request, res: Response<UsersListResponse>) => {
    const userRepo = AppDataSource.getRepository(UserEntity);
    const usersEntities = await userRepo.find({ relations: { role: true } });

    const users = usersEntities.map(entity => createUserDTOFromEntity(entity));

    res.send(users);
};

const deleteOne = async (req: Request, res: Response) => {
    const { id } = validateDeleteParams(req.params);
    
    const userRepo = AppDataSource.getRepository(UserEntity);
    const user = await userRepo.findOneBy({ id });

    if (!user) {
        throw createHttpError(404, 'Cannot find user');
    }

    await userRepo.remove(user);

    res.status(204).send();
};

export default {
    create,
    getAll,
    deleteOne
};
