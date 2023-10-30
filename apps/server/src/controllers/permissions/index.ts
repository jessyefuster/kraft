import type { PermissionsListResponse } from '@internal/types';
import type { Request, Response } from 'express';

import { AppDataSource } from '../../data-source';
import { PermissionEntity } from '../../entities/permission';
import { createPermissions, createPermissionsDTO } from '../../services/permissions';

const getAll = async (req: Request, res: Response<PermissionsListResponse>) => {
    const permissionsRepo = AppDataSource.getRepository(PermissionEntity);
    const permissionsEntities = await permissionsRepo.find({ relations: { group: true } });

    const permissions = createPermissions(permissionsEntities);

    res.send(createPermissionsDTO(permissions));
};

export default {
    getAll
};
