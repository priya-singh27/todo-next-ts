import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import { User } from '../model/user';
import { Todo } from '../model/todo';

const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;

console.log('Database Port:', dbPort);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: dbPort,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'todo_db',
  schema: process.env.DB_SCHEMA || 'public',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Todo],
  subscribers: [],
  migrations: ['src/migrations/**/*.ts'],
});