import type { RoleEditBody, RoleEditResponse, RoleGetResponse, RolePermissionsAddBody, RolePermissionsAddResponse, RolePermissionsGetResponse, RolePermissionsUpdateBody, RolePermissionsUpdateResponse, RolesCreateBody, RolesCreateResponse, RolesListResponse, RoleUsersAddBody, RoleUsersAddResponse, RoleUsersDeleteBody } from '@internal/types';
import type { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { In } from 'typeorm';

import { AppDataSource } from '../../data-source';
import { PermissionEntity } from '../../entities/permission';
import { RoleEntity } from '../../entities/role';
import { UserEntity } from '../../entities/user';
import type { Permission } from '../../models/permissions';
import { createPermissions } from '../../services/permissions';
import { createRole, createRoleDTO, createRoleDTOFromEntity, createRoleEntity, createRoles, mapRolesForRolesList } from '../../services/roles';
import { createUserDTOFromEntity, userHasPermissions } from '../../services/user';
import { validateCreateBody, validateDeleteParams, validateGetParams, validatePermissionsUpdatePayload, validateUpdatePayload, validateUsersAddPayload, validateUsersDeletePayload } from './validators';

const getAll = async (req: Request, res: Response<RolesListResponse>) => {
    const appendUsers = req.user && userHasPermissions(req.user, ['read:users']);

    const roleRepo = AppDataSource.getRepository(RoleEntity);
    const rolesEntities = await roleRepo.find({ relations: { permissions: { group: true }, users: appendUsers } });

    const roles = createRoles(rolesEntities);

    res.send(mapRolesForRolesList(roles));
};

const getOne = async (req: Request, res: Response<RoleGetResponse>) => {
    const { id } = validateGetParams(req.params);

    const appendUsers = req.user && userHasPermissions(req.user, ['read:users']);

    const roleRepo = AppDataSource.getRepository(RoleEntity);
    const roleEntity = await roleRepo.findOne({
        where: { id },
        relations: { permissions: { group: true }, users: appendUsers }
    });

    if (!roleEntity) {
        throw createHttpError(404, 'Cannot find role');
    }

    const role = createRole(roleEntity);
    const roleDTO = createRoleDTO(role);

    res.send(roleDTO);
};

const deleteOne = async (req: Request, res: Response) => {
    const { id } = validateDeleteParams(req.params);
    
    const roleRepo = AppDataSource.getRepository(RoleEntity);
    const roleEntity = await roleRepo.findOneBy({ id });

    if (!roleEntity) {
        throw createHttpError(404, 'Cannot find role');
    }

    if (roleEntity.isRoot) {
        throw createHttpError(403, 'Cannot delete root role');
    }

    await roleRepo.remove(roleEntity);

    res.status(204).send();
};

const createOne = async (req: TypedRequestBody<RolesCreateBody>, res: Response<RolesCreateResponse>) => {
    const { name, description, permissionsIds } = validateCreateBody(req.body);

    const roleRepo = AppDataSource.getRepository(RoleEntity);
    const roleExists = await roleRepo.exist({
        where: { name }
    });
    if (roleExists) {
        throw createHttpError(409, 'Role already exists');
    }
    
    let permissions: Permission[] = [];

    if (permissionsIds?.length) {
        const permissionRepo = AppDataSource.getRepository(PermissionEntity);
        const permissionEntities = await permissionRepo.findBy({ id: In(permissionsIds) });
        if (permissionEntities.length !== permissionsIds.length) {
            throw createHttpError(422, 'Cannot find permission');
        }
        permissions = createPermissions(permissionEntities);
    }

    const newRole = createRoleEntity({
        name,
        description,
        permissions
    });

    await roleRepo.save(newRole);

    res.status(201).send(createRoleDTOFromEntity(newRole));
};

const updateOne = async (req: TypedRequestBody<RoleEditBody>, res: Response<RoleEditResponse>) => {
    const { params: { id }, body: { name, description } } = validateUpdatePayload(req.params, req.body);

    const roleRepo = AppDataSource.getRepository(RoleEntity);
    const roleEntity = await roleRepo.findOneBy({ id });

    if (!roleEntity) {
        throw createHttpError(404, 'Cannot find role');
    }

    if (roleEntity.isRoot) {
        throw createHttpError(405, 'Role is read-only');
    }

    if (name) {
        const conflictingRoleEntity = await roleRepo.findOneBy({ name });

        if (conflictingRoleEntity && conflictingRoleEntity.id !== roleEntity.id) {
            throw createHttpError(409, 'Role name is already taken');
        }

        roleEntity.name = name;
    }
    if (description !== undefined) {
        roleEntity.description = description;
    }

    await roleRepo.save(roleEntity);

    res.status(200).send(createRoleDTOFromEntity(roleEntity));
};

const getPermissions = async (req: Request, res: Response<RolePermissionsGetResponse>) => {
    const { id } = validateGetParams(req.params);

    const roleRepo = AppDataSource.getRepository(RoleEntity);
    const roleEntity = await roleRepo.findOne({
        where: { id },
        relations: { permissions: { group: true } }
    });

    if (!roleEntity) {
        throw createHttpError(404, 'Cannot find role');
    }

    const role = createRoleDTOFromEntity(roleEntity);
    const rolePermissions = role.permissions ?? [];

    res.send(rolePermissions);
};

const addPermissions = async (req: TypedRequestBody<RolePermissionsAddBody>, res: Response<RolePermissionsAddResponse>) => {
    const { params: { id }, body: { permissionsIds } } = validatePermissionsUpdatePayload(req.params, req.body);

    const roleRepo = AppDataSource.getRepository(RoleEntity);
    const roleEntity = await roleRepo.findOne({
        where: { id },
        relations: { permissions: true }
    });

    if (!roleEntity) {
        throw createHttpError(404, 'Cannot find role');
    }

    if (roleEntity.isRoot) {
        throw createHttpError(405, 'Role is read-only');
    }

    let permissionEntities: PermissionEntity[] = [];

    if (permissionsIds.length) {
        const permissionRepo = AppDataSource.getRepository(PermissionEntity);
        permissionEntities = await permissionRepo.findBy({ id: In(permissionsIds) });
        if (permissionEntities.length !== permissionsIds.length) {
            throw createHttpError(422, 'Cannot find permission');
        }
    }

    const rolePermissionsEntities = roleEntity.permissions || [];
    const permissionsEntitiesToAdd = permissionEntities.filter(permission => !rolePermissionsEntities.find(rolePermission => rolePermission.id === permission.id));

    roleEntity.permissions = [...rolePermissionsEntities, ...permissionsEntitiesToAdd];

    await roleRepo.save(roleEntity);

    const role = createRoleDTOFromEntity(roleEntity);

    res.send(role.permissions ?? []);
};

const updatePermissions = async (req: TypedRequestBody<RolePermissionsUpdateBody>, res: Response<RolePermissionsUpdateResponse>) => {
    const { params: { id }, body: { permissionsIds } } = validatePermissionsUpdatePayload(req.params, req.body);

    const roleRepo = AppDataSource.getRepository(RoleEntity);
    const roleEntity = await roleRepo.findOne({
        where: { id }
    });

    if (!roleEntity) {
        throw createHttpError(404, 'Cannot find role');
    }

    if (roleEntity.isRoot) {
        throw createHttpError(405, 'Role is read-only');
    }

    let permissionEntities: PermissionEntity[] = [];

    if (permissionsIds.length) {
        const permissionRepo = AppDataSource.getRepository(PermissionEntity);
        permissionEntities = await permissionRepo.findBy({ id: In(permissionsIds) });
        if (permissionEntities.length !== permissionsIds.length) {
            throw createHttpError(422, 'Cannot find permission');
        }
    }

    roleEntity.permissions = permissionEntities;

    await roleRepo.save(roleEntity);

    const role = createRoleDTOFromEntity(roleEntity);

    res.send(role.permissions ?? []);
};

const addUsers = async (req: TypedRequestBody<RoleUsersAddBody>, res: Response<RoleUsersAddResponse>) => {
    const { params: { id }, body: { usersIds } } = validateUsersAddPayload(req.params, req.body);

    const roleRepo = AppDataSource.getRepository(RoleEntity);
    const roleEntity = await roleRepo.findOne({
        where: { id }
    });

    if (!roleEntity) {
        throw createHttpError(404, 'Cannot find role');
    }

    if (roleEntity.isRoot) {
        throw createHttpError(405, 'Role is read-only');
    }

    const userRepo = AppDataSource.getRepository(UserEntity);
    
    if (usersIds.length) {
        const userEntities = await userRepo.findBy({ id: In(usersIds) });

        if (userEntities.length !== usersIds.length) {
            throw createHttpError(422, 'Cannot find user');
        }

        userEntities.forEach(userEntity => userEntity.roleId = id);

        await userRepo.save(userEntities);
    }

    const usersEntities = await userRepo.find({
        where: { roleId: id }
    });
    const users = usersEntities.map(entity => createUserDTOFromEntity(entity));

    res.send(users);
};

const deleteUsers = async (req: TypedRequestBody<RoleUsersDeleteBody>, res: Response<RoleUsersAddResponse>) => {
    const { params: { id }, body: { usersIds } } = validateUsersDeletePayload(req.params, req.body);

    const roleRepo = AppDataSource.getRepository(RoleEntity);
    const roleEntity = await roleRepo.findOne({
        where: { id }
    });

    if (!roleEntity) {
        throw createHttpError(404, 'Cannot find role');
    }

    if (roleEntity.isRoot) {
        throw createHttpError(405, 'Role is read-only');
    }

    const userRepo = AppDataSource.getRepository(UserEntity);
    
    if (usersIds.length) {
        const userEntities = await userRepo.findBy({ id: In(usersIds), roleId: id });

        if (userEntities.length !== usersIds.length) {
            throw createHttpError(422, 'Cannot find user');
        }

        userEntities.forEach(userEntity => userEntity.roleId = null);

        await userRepo.save(userEntities);
    }

    const usersEntities = await userRepo.find({
        where: { roleId: id }
    });
    const users = usersEntities.map(entity => createUserDTOFromEntity(entity));

    res.send(users);
};

export default {
    getAll,
    deleteOne,
    createOne,
    getOne,
    updateOne,
    getPermissions,
    addPermissions,
    updatePermissions,
    addUsers,
    deleteUsers
};
