import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { ApiProperty } from '@nestjs/swagger';
import { PlatformProductOrderInfluencerEntity } from './platform-product-order-influencer.entity';

export class PlatformProductOrderInfluencerPagination extends PaginationResult<PlatformProductOrderInfluencerEntity> {
  @ApiProperty({ type: [PlatformProductOrderInfluencerEntity] })
  result: PlatformProductOrderInfluencerEntity[];
}
