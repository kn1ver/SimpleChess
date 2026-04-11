import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 4000,
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/chess',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key',
  NODE_ENV: process.env.NODE_ENV || 'development',
};