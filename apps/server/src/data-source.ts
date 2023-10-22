import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_HOST : process.env.DB_HOST,
    port: process.env.NODE_ENV === 'test' ? Number(process.env.TEST_DB_PORT) : Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME,
    logging: false,
    dropSchema: process.env.NODE_ENV === 'test',
    migrationsRun: process.env.NODE_ENV === 'test',
    entities: process.env.NODE_ENV === 'production' ? ['dist/entities/**/*.js'] : [join(__dirname, './entities/**/*.ts')],
    subscribers: process.env.NODE_ENV === 'production' ? ['dist/subscribers/**/*.js'] : [join(__dirname, './subscribers/**/*.ts')],
    migrations: process.env.NODE_ENV === 'production' ? ['dist/migrations/**/*.js'] : [join(__dirname, './migrations/**/*.ts')],
});
