import { ApiProperty } from '@nestjs/swagger';
import { InfluencerCampaignAmount } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { IsDefined, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PostType } from '../enums/post-type.enum';

export class UpsertCampaignDesiredIncomeDto
  implements Partial<InfluencerCampaignAmount>
{
  @IsNumber()
  @IsOptional()
  id?: number;

  // * property is given by URL
  /* @IsNumber()
  // @IsDefined()
  influencerId: number; */

  @IsEnum(PostType)
  // @IsDefined()
  postType: PostType;

  @ApiProperty({ type: Number })
  @IsNumber()
  desiredAmount: Decimal;
}
