import type { RoleEditBody, RoleGetParams, RolesCreateBody, RolesDeleteParams } from '@internal/types';
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

export const validateCreateBody = (body: Partial<RolesCreateBody>) => {
    const { name, permissionsIds } = body;

    if (!name) {
        throw createHttpError(400, 'Name required');
    }

    for (const permissionId of (permissionsIds || [])) {
        if (!isUUID(permissionId, '4')) {
            throw createHttpError(422, 'Cannot find permission');
        }
    }

    return body as RolesCreateBody;
};

export const validateGetParams = (params: Partial<RoleGetParams>) => {
    const { id } = params;

    if (!id) {
        throw createHttpError(400, 'Role id required');
    }
    if (!isUUID(id, '4')) {
        throw createHttpError(404, 'Cannot find role');
    }

    return params as RoleGetParams;
};

export const validateUpdatePayload = (params: Partial<RoleGetParams>, body: Partial<RoleEditBody>) => {
    const { id } = params;
    const { name, description } = body;

    if (!id) {
        throw createHttpError(400, 'Role id required');
    }
    if (!isUUID(id, '4')) {
        throw createHttpError(404, 'Cannot find role');
    }

    if (name === '') {
        throw createHttpError(400, 'Name cannot be empty');
    }

    return { params, body: { ...body, description: description === '' ? null : description } } as {
        params: RoleGetParams;
        body: Partial<RoleEditBody>;
    };
};
