import { IsArray, IsInt } from 'class-validator';

export class CampaignApproveInfluencers {
  @IsArray()
  @IsInt({ each: true })
  influencerIds: number[];
}
