import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { ApiProperty } from '@nestjs/swagger';
import { BenefitEntity } from '../entities';

export class BenefitPaginationResult extends PaginationResult<BenefitEntity> {
  @ApiProperty({ type: [BenefitEntity] })
  result: BenefitEntity[];
}
