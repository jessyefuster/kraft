import type { Request } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { AppDataSource } from '../data-source';
import { UserEntity } from '../entities/user';
import { UserMapper } from '../mappers/user';
import { RoleMapper } from '../mappers/roles';
import { PermissionGroupMapper, PermissionMapper } from '../mappers/permissions';

passport.use(
    new LocalStrategy(
        {
            usernameField: 'login',
            passwordField: 'password',
        },
        async (login, password, done) => {
            try {
                const userRepo = AppDataSource.getRepository(UserEntity);
                
                // Search a user whose username or email is the login parameter
                const userEntity = await userRepo.findOne({
                    where: [{ username: login }, { email: login }],
                    relations: { role: { permissions: true } }
                });

                // If the user doesn't exist or the password is wrong, return error as null and user as null
                // It allows to distinguish technical error and wrong credentials
                if (!userEntity || !userEntity.verifyPassword(password)) {
                    return done(null, undefined);
                }
                const permissionGroupMapper = new PermissionGroupMapper();
                const permissionMapper = new PermissionMapper(permissionGroupMapper);
                const roleMapper = new RoleMapper(permissionMapper);
                const userMapper = new UserMapper(roleMapper);

                return done(null, userMapper.fromEntity(userEntity));
            } catch (err) {
                return done(err);
            }
        },
    ),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (req: Request, id: string, done: any) => {
    const userRepo = AppDataSource.getRepository(UserEntity);
    const userEntity = await userRepo.findOne({
        where: { id },
        relations: { role: { permissions: true } }
    });
    const permissionGroupMapper = new PermissionGroupMapper();
    const permissionMapper = new PermissionMapper(permissionGroupMapper);
    const roleMapper = new RoleMapper(permissionMapper);
    const userMapper = new UserMapper(roleMapper);

    if (!userEntity) {
        // if passport tries to deserialize user but id doesn't exist anymore in db,
        // it means the user has been deleted, so logout the request
        req.logout(() => undefined);
        done(null, null);
    } else {
        done(null, userMapper.fromEntity(userEntity));
    }
});

export default passport;
