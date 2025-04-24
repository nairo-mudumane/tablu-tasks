import 'dotenv/config';

import { z } from 'zod';

const schema = z.object({
  PORT: z.union([z.string(), z.number()]),
  NODE_ENV: z.enum(['dev', 'stg', 'prod']).default('dev'),
  ALLOWED_ORIGINS: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.union([z.string(), z.number()]),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_ROOT_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DATABASE_URL: z.string().url(),
});

export const ENV = schema.parse(process.env);
