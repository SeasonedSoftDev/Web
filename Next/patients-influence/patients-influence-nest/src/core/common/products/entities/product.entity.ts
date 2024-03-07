import { Product } from '@prisma/client';
import { Transform } from 'class-transformer';
import { UserEntity } from 'src/core/users/entities/user.entity';

export class ProductEntity implements Product {
  id: number;
  name: string;
  genericName: string;
  createdByClientId: number;
  isApproved: boolean;
  productGenericNameId: number;
  isBranded: boolean;
  createdAt: Date;
  updatedAt: Date;

  @Transform((obj) => new UserEntity(obj.value))
  createdByUser?: UserEntity;

  constructor({ createdByUser, ...data }: Partial<ProductEntity>) {
    Object.assign(this, data);

    if (createdByUser) this.createdByUser = createdByUser;
  }
}
