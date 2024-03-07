import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { ApiProperty } from '@nestjs/swagger';
import { SymptomEntity } from './symptom.entity';

export class SymptomPaginationEntity extends PaginationResult<SymptomEntity> {
  @ApiProperty({ type: [SymptomEntity] })
  result: SymptomEntity[];
}
