import { PlatformProductOrderInfluencer } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Transform } from 'class-transformer';

export class AddInfluencersEntity implements PlatformProductOrderInfluencer {
  constructor(partial: Partial<AddInfluencersEntity>) {
    Object.assign(this, partial);
  }
  id: number;
  productOrderId: number;
  influencerId: number;
  @Transform((obj) => obj.value.toNumber())
  agreedAmount: Decimal;
  currency: number;
  status: number;
  signedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
