import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../src/.env') });
import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { AppDataSource } from './config/db';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(helmet());
app.use(express.json());

import user from './routes/user';
import todo from './routes/todo';

app.use('/user', user);
app.use('/todo',todo);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established...');
    
    app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}...`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });