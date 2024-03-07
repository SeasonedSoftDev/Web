import { IsInt, IsArray } from 'class-validator';

export class DeleteManyCampaignsDto {
  @IsArray()
  @IsInt({ each: true })
  campaignIds: number[];
}
