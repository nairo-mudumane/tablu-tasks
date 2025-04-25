import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import {
  ERR_INVALID_EMAIL,
  ERR_REQUIRED_FIELD,
  ERR_UNKNOWN_ORIGIN,
} from '../../shared/error-messages';
import { prisma } from '../../lib/prisma';
import { JWT } from '../../lib/jwt';

const schema = z.object({
  email: z.string({ message: ERR_INVALID_EMAIL }),
  password: z.string({ required_error: ERR_REQUIRED_FIELD }),
});

export async function login(request: Request, response: Response) {
  try {
    const { password, email } = schema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error(ERR_UNKNOWN_ORIGIN);

    if (!(await bcrypt.compare(password, user.password_hash)))
      throw new Error(ERR_UNKNOWN_ORIGIN);

    const token = JWT.setToken(user.id);

    return response.status(200).json({
      message: 'ok',
      count: 1,
      data: { ...user, token, password_hash: undefined },
    });
  } catch (error) {
    return response.status(401).json({ message: (error as Error).message });
  }
}
