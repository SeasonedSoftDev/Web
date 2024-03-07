import { ApiProperty } from '@nestjs/swagger';
import { CompanyTitleEntity } from './company-title.entity';
import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';

export class CompanyTitlePaginationEntity extends PaginationResult<CompanyTitleEntity> {
  @ApiProperty({ type: [CompanyTitleEntity] })
  result: CompanyTitleEntity[];
}
