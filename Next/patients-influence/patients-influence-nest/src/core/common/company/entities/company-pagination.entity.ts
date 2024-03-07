import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { CompanyEntity } from './company.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyPaginationEntity extends PaginationResult<CompanyEntity> {
  @ApiProperty({ type: [CompanyEntity] })
  result: CompanyEntity[];
}
