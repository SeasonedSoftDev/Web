import { InfluencerCampaignAmount } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Transform } from 'class-transformer';

export class InfluencerCampaignAmountEntity
  implements InfluencerCampaignAmount
{
  id: number;
  influencerId: number;
  postType: number;
  @Transform(
    (obj) => {
      if (obj.value === null) return obj.value;

      return obj.value.toNumber();
    },
    { toPlainOnly: true },
  )
  desiredAmount: Decimal;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<InfluencerCampaignAmountEntity>) {
    Object.assign(this, partial);
  }
}
