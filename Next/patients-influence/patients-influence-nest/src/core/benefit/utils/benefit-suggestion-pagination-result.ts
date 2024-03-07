import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { ApiProperty } from '@nestjs/swagger';
import { BenefitSuggestionEntity } from '../entities';

export class BenefitSuggestionPaginationResult extends PaginationResult<BenefitSuggestionEntity> {
  @ApiProperty({ type: [BenefitSuggestionEntity] })
  result: BenefitSuggestionEntity[];
}
