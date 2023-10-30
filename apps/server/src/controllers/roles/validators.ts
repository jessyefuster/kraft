import type { RoleEditBody, RoleGetParams, RolePermissionsAddBody, RolesCreateBody, RolesDeleteParams } from '@internal/types';
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
    const validatedParams = validateGetParams(params);
    const { name, description } = body;

    if (name === '') {
        throw createHttpError(400, 'Name cannot be empty');
    }

    return { params: validatedParams, body: { ...body, description: description === '' ? null : description } };
};

export const validatePermissionsUpdatePayload = (params: Partial<RoleGetParams>, body: Partial<RolePermissionsAddBody>) => {
    const validatedParams = validateGetParams(params);
    const { permissionsIds } = body;

    if (!permissionsIds) {
        throw createHttpError(400, 'Permissions ids required');
    }

    for (const permissionId of permissionsIds) {
        if (!isUUID(permissionId, '4')) {
            throw createHttpError(422, 'Cannot find permission');
        }
    }

    return { params: validatedParams, body: { permissionsIds: [...new Set(permissionsIds)] } as RolePermissionsAddBody };
};
