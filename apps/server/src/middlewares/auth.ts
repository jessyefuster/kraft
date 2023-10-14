import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import type { AnyPermission } from '../models/permissions';
import { roleHasPermissions } from '../services/roles';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        next(createHttpError(401, 'User must be authenticated'));
    }
};

export const isUnauthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isUnauthenticated()) {
        next();
    } else {
        next(createHttpError(401, 'User must not be authenticated'));
    }
};

export const hasPermissions = (neededPermissions: AnyPermission[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        next(createHttpError(401, 'User must not be authenticated'));
    } else if (roleHasPermissions(req.user.role, neededPermissions)) {
        next(createHttpError(403, 'Unsufficient permissions'));
    } else {
        next();
    }
};
