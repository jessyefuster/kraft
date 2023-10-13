import type { Request } from 'express';

import type { UserEntity } from '../../src/entities/user';

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserEntity;
    }
}

declare global {
    /**
    * Interface used to type request body.
    */
    interface TypedRequestBody<T> extends Request {
        body: Partial<T>; // Use Partial to set all properties optional because we cannot be sure the client will send all required properties
    }
}