import { ApiProperty } from '@nestjs/swagger';
import { InfluencerSurveyAmount } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { IsDefined, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SurveyType } from '../enums/survey-type.enum';

export class UpsertSurveyDesiredIncomeDto
  implements Partial<InfluencerSurveyAmount>
{
  @IsNumber()
  @IsOptional()
  id?: number;

  // * property is given by URL
  /* @IsNumber()
  // @IsDefined()
  influencerId: number; */

  @IsEnum(SurveyType)
  // @IsDefined()
  surveyType: SurveyType;

  @ApiProperty({ type: Number })
  @IsNumber()
  desiredAmount: Decimal;
}
