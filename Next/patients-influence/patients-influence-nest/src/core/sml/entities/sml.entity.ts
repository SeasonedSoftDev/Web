import { PlatformProductOrder, SocialMediaListening } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import { PlatformProductOrderEntity } from 'src/core/platform-product/entities';

export class SmlEntity implements SocialMediaListening {
  constructor(partial: Partial<SmlEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  platformProductOrderId: number;
  subscriptionLength: number;
  monthlyTokens: number;
  smlDescription: string;
  status: number;
  startedAt: Date;
  createdAt: Date;
  updatedAt: Date;

  @Type(() => PlatformProductOrderEntity)
  platformProductOrder: PlatformProductOrder;
}
