import { JwtService } from '@nestjs/jwt';
import { SocketWithAuth } from '../types';
import { ForbiddenException, Logger } from '@nestjs/common';
import { parse } from 'cookie';
import { ConfigService } from '@nestjs/config';
import { NextFunction } from 'express';
import { IUserJwtPayload } from 'src/core/auth/interfaces/jwt-payload.interface';

export const createAuthMiddleware =
  (jwtService: JwtService, cookieName: string, logger: Logger) =>
  async (socket: SocketWithAuth, next: NextFunction) => {
    const cookie = socket.handshake?.headers['x-jwt-cookie'];
    try {
      const { [cookieName]: token } = parse(cookie.toString());
      const payload: IUserJwtPayload = (await jwtService.verify(token)).user;
      socket.authPayload = payload;
      next();
    } catch (error: any) {
      logger.error(error.message, error.stack);
      next(new ForbiddenException());
    }
  };
