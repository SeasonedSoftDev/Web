import { IsArray, IsInt } from 'class-validator';

export class CampaignInviteInfluencers {
  @IsArray()
  @IsInt({ each: true })
  influencerIds: number[];
}
