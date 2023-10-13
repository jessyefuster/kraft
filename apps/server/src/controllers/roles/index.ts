import type { RolesListResponse } from '@internal/types';
import type { Request, Response } from 'express';

import { AppDataSource } from '../../data-source';
import { RoleEntity } from '../../entities/role';
import { PermissionGroupMapper, PermissionMapper } from '../../mappers/permissions';
import { RoleMapper } from '../../mappers/roles';

const getAll = async (req: Request, res: Response<RolesListResponse>) => {
    const roleRepo = AppDataSource.getRepository(RoleEntity);
    const rolesEntities = await roleRepo.find({ relations: { permissions: { group: true } } });

    const permissionGroupMapper = new PermissionGroupMapper();
    const permissionMapper = new PermissionMapper(permissionGroupMapper);
    const roleMapper = new RoleMapper(permissionMapper);

    const roles = rolesEntities.map((roleEntity) => roleMapper.fromEntity(roleEntity))

    res.send(roles.map(role => roleMapper.toDTO(role)));
};

export default {
    getAll
};
