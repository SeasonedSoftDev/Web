import { IsInt, IsArray } from 'class-validator';

export class DeleteManyCampaignReportsDto {
  @IsArray()
  @IsInt({ each: true })
  reportIds: number[];
}
