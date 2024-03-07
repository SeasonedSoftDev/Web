import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { ApiProperty } from '@nestjs/swagger';
import { CampaignReportEntity } from './campaign-report.entity';

export class CampaignReportPaginationEntity extends PaginationResult<CampaignReportEntity> {
  @ApiProperty({ type: [CampaignReportEntity] })
  result: CampaignReportEntity[];
}
