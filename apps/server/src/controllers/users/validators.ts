import type { UsersCreateBody, UsersDeleteParams } from '@internal/types';
import createHttpError from 'http-errors';
import isEmail from 'validator/lib/isEmail';
import isUUID from 'validator/lib/isUUID';

export const validateCreateBody = (body: Partial<UsersCreateBody>) => {
    const { username, email, password, roleId } = body;

    if (!username) {
        throw createHttpError(400, 'Username required');
    }
    if (username.length < 5) {
        throw createHttpError(400, 'Username must contain at least 5 characters');
    }

    if (!email) {
        throw createHttpError(400, 'Email required');
    }
    if (!isEmail(email)) {
        throw createHttpError(400, 'Email is invalid');
    }

    if (!password) {
        throw createHttpError(400, 'Password required');
    }
    if (password.length < 8) {
        throw createHttpError(400, 'Password must contain at least 8 characters');
    }

    if (roleId && !isUUID(roleId, '4')) {
        throw createHttpError(422, 'Cannot find role');
    }

    // As the function checked the properties are not missing,
    // return the body as original type
    return body as UsersCreateBody;
};

export const validateDeleteParams = (params: Partial<UsersDeleteParams>) => {
    const { id } = params;

    if (!id || !isUUID(id, '4')) {
        throw createHttpError(404, 'Cannot find user');
    }

    return params as UsersDeleteParams;
};
