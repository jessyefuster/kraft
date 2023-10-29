import type { RoleEditBody, RoleEditResponse, RoleGetResponse, RolePermissionsGetResponse, RolesCreateBody, RolesCreateResponse, RolesListResponse } from '@internal/types';
import type { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { In } from 'typeorm';

import { AppDataSource } from '../../data-source';
import { PermissionEntity } from '../../entities/permission';
import { RoleEntity } from '../../entities/role';
import type { Permission } from '../../models/permissions';
import { createPermissions } from '../../services/permissions';
import { createRoleDTOFromEntity, createRoleEntity, createRoles, mapRolesForRolesList } from '../../services/roles';
import { validateCreateBody, validateDeleteParams, validateGetParams, validateUpdatePayload } from './validators';

const getAll = async (req: Request, res: Response<RolesListResponse>) => {
    const roleRepo = AppDataSource.getRepository(RoleEntity);
    const rolesEntities = await roleRepo.find({ relations: { permissions: { group: true } } });

    const roles = createRoles(rolesEntities);

    res.send(mapRolesForRolesList(roles));
};

const getOne = async (req: Request, res: Response<RoleGetResponse>) => {
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

    res.send(role);
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

const getRolePermissions = async (req: Request, res: Response<RolePermissionsGetResponse>) => {
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

    res.send(role.permissions || []);
};

export default {
    getAll,
    deleteOne,
    createOne,
    getOne,
    updateOne,
    getRolePermissions
};
