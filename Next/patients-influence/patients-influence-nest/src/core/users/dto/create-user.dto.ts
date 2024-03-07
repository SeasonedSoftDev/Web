import { User } from '@prisma/client';

export class CreateUserDto implements Partial<User> {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  locationId: number;
  role: number;
  status: number;
  isDeleted: boolean;
  currency: number;
  createdAt: Date;
  updatedAt: Date;
}
