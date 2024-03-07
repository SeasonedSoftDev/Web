import { IsInt, IsArray } from 'class-validator';

export class CampaignConfirmMatchDto {
  @IsArray()
  @IsInt({ each: true })
  platformInfluencerIds: number[];
}
