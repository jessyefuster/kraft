import path from 'path';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import createHttpError from 'http-errors';
import morgan from 'morgan';

import { errorHandler } from '../middlewares/errorHandler';
import apiRoutes from '../routes/api';
import passport from './passport';
import session from './session';

const createServer = () => {
    const app = express();

    const corsOptions = {
        origin: process.env.CORS_ORIGIN_ALLOWED,
        credentials: true,
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    };

    app.use(morgan('dev'));
    app.use(cors(corsOptions));
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(helmet());
    app.set('json spaces', 2);

    app.use(session);

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(`/api`, apiRoutes);
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static('dist/client'));
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../../client/index.html'));
        });
    } else {
        app.get('*', (req, res) => {
            throw createHttpError(404, 'Resource Not Found');
        });
    }

    app.use(errorHandler);

    return app;
};

export default createServer;