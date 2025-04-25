import { prisma } from '../lib/prisma';

type CbFn = () => Promise<unknown>;

export async function connectToDatabase(callback: CbFn) {
  await prisma.$connect();
  // eslint-disable-next-line no-console
  console.info('connected to database');
  await callback();
  await prisma.$disconnect();
}
