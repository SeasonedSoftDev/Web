import { Product } from '@prisma/client';
import { Type } from 'class-transformer';
import { ClientEntity } from 'src/core/client/entities/client.entity';

export class CompanyProductEntity implements Product {
  id: number;
  name: string;
  createdByClientId: number;
  isApproved: boolean;
  productGenericNameId: number;
  isBranded: boolean;
  createdAt: Date;
  updatedAt: Date;

  @Type(() => ClientEntity)
  createdByUser?: ClientEntity;

  constructor({ createdByUser, ...data }: Partial<CompanyProductEntity>) {
    Object.assign(this, data);

    if (createdByUser) this.createdByUser = createdByUser;
  }
  genericName: string;
}
