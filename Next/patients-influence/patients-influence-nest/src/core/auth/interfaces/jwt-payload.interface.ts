import { User } from '@prisma/client';

export interface IJWTPayload {
  user: IUserJwtPayload;
}

export type IUserJwtPayload = Partial<Omit<User, 'password'>>;
