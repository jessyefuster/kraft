import dotenv from 'dotenv';
import 'reflect-metadata';

import createServer from './config/server';
import { AppDataSource } from './data-source';

dotenv.config();

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || '8080';

const app = createServer();

AppDataSource.initialize()
    .then(() => {
        app.listen({ host, port }, () => {
            console.info(`⚡️ Server is running at http://${host}:${port}`);
        });
    })
    .catch(console.error);