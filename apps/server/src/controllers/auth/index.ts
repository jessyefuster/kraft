import type { AuthLoginBody, AuthLoginResponse } from '@internal/types';
import type { NextFunction, Request, Response } from 'express';
import type { HttpError } from 'http-errors';
import createHttpError from 'http-errors';
import passport from 'passport';

import { PermissionGroupMapper, PermissionMapper } from '../../mappers/permissions';
import { RoleMapper } from '../../mappers/roles';
import { UserMapper } from '../../mappers/user';
import type { User } from '../../models/users';
import { validateLoginBody } from './validators';

const login = (
    req: TypedRequestBody<AuthLoginBody>,
    res: Response<AuthLoginResponse>,
    next: NextFunction,
) => {
    validateLoginBody(req.body);

    passport.authenticate(
        'local',
        (err: HttpError | null, user: User | undefined) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return next(
                    createHttpError(401, 'Incorrect credentials'),
                );
            }

            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }

                return res.send(UserMapper.toDTO(user));
            });
        },
    )(req, res, next);
};

const logout = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => res.send());
    });
};

const authenticated = (
    req: Request,
    res: Response,
) => {
    if (req.isAuthenticated()) {
        res.status(204).send();
    } else {
        res.status(401).send();
    }
};

export default {
    login,
    logout,
    authenticated,
};