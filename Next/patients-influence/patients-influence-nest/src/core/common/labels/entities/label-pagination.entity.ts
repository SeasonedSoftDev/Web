import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { ApiProperty } from '@nestjs/swagger';
import { LabelEntity } from './label.entity';

export class LabelPaginationEntity extends PaginationResult<LabelEntity> {
  @ApiProperty({ type: [LabelEntity] })
  result: LabelEntity[];
}
