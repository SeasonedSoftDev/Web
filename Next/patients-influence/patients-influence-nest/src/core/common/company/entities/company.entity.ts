import { Company } from '@prisma/client';
import { Type } from 'class-transformer';
import { UserEntity } from 'src/core/users/entities/user.entity';

export class CompanyEntity implements Company {
  id: number;
  name: string;
  createdByUserId: number;
  isCommon: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;

  @Type(() => UserEntity)
  createdByUser?: UserEntity;

  constructor({ createdByUser, ...data }: Partial<CompanyEntity>) {
    Object.assign(this, data);

    if (createdByUser) this.createdByUser = createdByUser;
  }
}
