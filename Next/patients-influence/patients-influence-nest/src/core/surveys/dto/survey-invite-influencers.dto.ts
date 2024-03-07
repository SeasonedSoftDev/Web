import { IsArray, IsInt } from 'class-validator';

export class SurveyInviteInfluencers {
  @IsArray()
  @IsInt({ each: true })
  influencerIds: number[];
}
