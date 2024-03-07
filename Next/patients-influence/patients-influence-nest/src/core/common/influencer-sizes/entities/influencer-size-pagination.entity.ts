import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { ApiProperty } from '@nestjs/swagger';
import { InfluencerSizeEntity } from './influencer-size.entity';

export class InfluencerSizePaginationEntity extends PaginationResult<InfluencerSizeEntity> {
  @ApiProperty({ type: [InfluencerSizeEntity] })
  result: InfluencerSizeEntity[];
}
