import { InfluencerSurveyAmount } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Transform } from 'class-transformer';

export class InfluencerSurveyAmountEntity implements InfluencerSurveyAmount {
  id: number;
  influencerId: number;
  surveyType: number;
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

  constructor(partial: Partial<InfluencerSurveyAmountEntity>) {
    Object.assign(this, partial);
  }
}
