import { IsInt, IsOptional } from 'class-validator';

export class GetInfluencerSurveyDto {
  @IsInt()
  @IsOptional()
  influencerId?: number;
}
