/* eslint-disable no-console */

import bcrypt from 'bcryptjs';

import { prisma } from '../lib/prisma';
import { ENV } from '../lib/dotenv';

export async function checkForSeeds() {
  const usersCount = await prisma.user.count();
  if (usersCount <= 0) {
    console.log('[seeds]: seeding...');

    const password_hash = await bcrypt.hash(ENV.DEFAULT_USER_PASSWORD, 10);
    const defaultUser = await prisma.user.create({
      data: {
        email: ENV.DEFAULT_USER_EMAIL,
        username: ENV.DEFAULT_USER_EMAIL,
        password_hash,
      },
    });
    console.log('[seeds]: created default user');
    console.log(`[seeds]: ${JSON.stringify(defaultUser)}`);
  }
}
