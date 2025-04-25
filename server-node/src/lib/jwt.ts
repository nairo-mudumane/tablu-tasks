import jwt from 'jsonwebtoken';

import { ENV } from './dotenv';

const setToken = (userId: number): string => {
  return jwt.sign({ id: userId }, ENV.JWT_SECRET, { expiresIn: '1h' });
};

const checkToken = (token: string): { id: string | number } => {
  return jwt.verify(token, ENV.JWT_SECRET) as { id: string | number };
};

export const JWT = { setToken, checkToken };
