import type { RolesDeleteParams } from '@internal/types';
import createHttpError from 'http-errors';
import isUUID from 'validator/lib/isUUID';

export const validateDeleteParams = (params: Partial<RolesDeleteParams>) => {
    const { id } = params;

    if (!id) {
        throw createHttpError(400, 'Role id required');
    }
    if (!isUUID(id, '4')) {
        throw createHttpError(404, 'Cannot find role');
    }

    return params as RolesDeleteParams;
};
