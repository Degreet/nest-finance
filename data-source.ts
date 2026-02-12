import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

config({
  path: resolve(__dirname, `.env.${process.env.NODE_ENV ?? 'staging'}`),
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: ['src/**/*/entities/*.ts'],
  migrations: ['migrations/*.ts'],
});
