import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { IndustryEntity } from './industry.entity';
import { ApiProperty } from '@nestjs/swagger';

export class IndustryPaginationEntity extends PaginationResult<IndustryEntity> {
  @ApiProperty({ type: [IndustryEntity] })
  result: IndustryEntity[];
}
