import 'dotenv/config';

import { z } from 'zod';

const schema = z.object({
  PORT: z.union([z.string(), z.number()]),
  NODE_ENV: z.enum(['dev', 'stg', 'prod']).default('dev'),
  ALLOWED_ORIGINS: z.string(),
  LOG_LEVEL: z.string(),
  MYSQL_HOST: z.string(),
  MYSQL_PORT: z.union([z.string(), z.number()]),
  MYSQL_USER: z.string(),
  MYSQL_PASSWORD: z.string(),
  MYSQL_ROOT_PASSWORD: z.string(),
  MYSQL_DATABASE: z.string(),
  DATABASE_URL: z.string().url(),
  RABBITMQ_HOST: z.string(),
  RABBITMQ_PORT: z.union([z.string(), z.number()]),
  RABBITMQ_USER: z.string(),
  RABBITMQ_PASSWORD: z.string(),
});

export const ENV = schema.parse(process.env);
