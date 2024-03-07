import { PlatformProductOrderInfluencer } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Transform } from 'class-transformer';
import { ProductOrderInfluencerStatus } from '../enums/product-order-influencer-status.enum';

export class PlatformProductOrderInfluencerEntity
  implements PlatformProductOrderInfluencer
{
  id: number;
  productOrderId: number;
  influencerId: number;
  @Transform((obj) => obj.value.toNumber(), { toPlainOnly: true })
  agreedAmount: Decimal;
  currency: number;
  status: ProductOrderInfluencerStatus;
  signedAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<PlatformProductOrderInfluencerEntity>) {
    Object.assign(this, partial);
  }
}
