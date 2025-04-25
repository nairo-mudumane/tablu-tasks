import { Request, Response, NextFunction } from 'express';

import {
  ERR_LOGIN_EXPIRED,
  ERR_UNKNOWN_ORIGIN,
} from '../shared/error-messages';
import { JWT } from '../lib/jwt';
import { prisma } from '../lib/prisma';

type IRouteType = (
  request: Request,
  response: Response,
  next: NextFunction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any>;

export class AuthMiddleware {
  public Public: IRouteType;
  public Private: IRouteType;

  constructor() {
    this.Public = this.usePublicAuth;
    this.Private = this.usePrivateAuth;
  }

  private async usePublicAuth(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) return next();
      else {
        const parts = authHeader.split(' ');
        if (parts.length !== 2) throw new Error(ERR_LOGIN_EXPIRED);

        const [scheme, token] = parts;
        if (!/^BEARER$/i.test(scheme)) throw new Error(ERR_LOGIN_EXPIRED);

        const decoded = JWT.checkToken(token);

        if (!decoded) throw new Error(ERR_UNKNOWN_ORIGIN);

        const user = await prisma.user.findUnique({
          where: { id: Number(decoded.id) },
        });
        if (!user) throw new Error(ERR_UNKNOWN_ORIGIN);

        request.user = user;

        return next();
      }
    } catch (error) {
      return response.status(401).json({ message: (error as Error).message });
    }
  }

  private async usePrivateAuth(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) throw new Error(ERR_LOGIN_EXPIRED);
      else {
        const parts = authHeader.split(' ');
        if (parts.length !== 2) throw new Error(ERR_LOGIN_EXPIRED);

        const [scheme, token] = parts;
        if (!/^BEARER$/i.test(scheme)) throw new Error(ERR_LOGIN_EXPIRED);

        const decoded = JWT.checkToken(token);

        if (!decoded) throw new Error(ERR_UNKNOWN_ORIGIN);

        const user = await prisma.user.findUnique({
          where: { id: Number(decoded.id) },
        });
        if (!user) throw new Error(ERR_UNKNOWN_ORIGIN);

        request.user = user;

        return next();
      }
    } catch (error) {
      return response.status(401).json({ message: (error as Error).message });
    }
  }
}
