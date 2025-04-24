import 'dotenv/config';

import { z } from 'zod';

const schema = z.object({
  PORT: z.union([z.string(), z.number()]),
  NODE_ENV: z.enum(['dev', 'stg', 'prod']).default('dev'),
  ALLOWED_ORIGINS: z.string(),
});

export const ENV = schema.parse(process.env);
