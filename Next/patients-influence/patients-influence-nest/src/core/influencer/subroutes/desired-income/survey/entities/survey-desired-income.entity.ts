import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { InfluencerSurveyAmount } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime';

export class SurveyDesiredIncomeEntity implements InfluencerSurveyAmount {
  id: number;

  @ApiHideProperty()
  @Exclude()
  influencerId: number;

  surveyType: number;

  @ApiProperty({ type: Number })
  @Transform((obj) => obj.value.toNumber(), { toPlainOnly: true })
  desiredAmount: Decimal;

  createdAt: Date;

  updatedAt: Date;

  constructor({ ...data }: Partial<SurveyDesiredIncomeEntity>) {
    Object.assign(this, data);
  }
}
