import { PrismaClient } from '@prisma/client';

import { PrismaClient as GeneratedPrismaClient } from '../generated/prisma/client';

const getPrismaClient = () => {
  if (GeneratedPrismaClient) return new GeneratedPrismaClient();
  else return PrismaClient() as ReturnType<typeof GeneratedPrismaClient>;
};

export const prisma = getPrismaClient();
