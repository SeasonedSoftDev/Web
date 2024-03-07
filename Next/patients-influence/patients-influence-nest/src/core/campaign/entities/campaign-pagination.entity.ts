import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { ApiProperty } from '@nestjs/swagger';
import { CampaignEntity } from './campaign.entity';

export class CampaignPaginationEntity extends PaginationResult<CampaignEntity> {
  @ApiProperty({ type: [CampaignEntity] })
  result: CampaignEntity[];
}
