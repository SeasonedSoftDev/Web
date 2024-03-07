import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { DiseaseAreaEntity } from './disease-area.entity';
import { ApiProperty } from '@nestjs/swagger';

export class DiseaseAreaPaginationEntity extends PaginationResult<DiseaseAreaEntity> {
  @ApiProperty({ type: [DiseaseAreaEntity] })
  result: DiseaseAreaEntity[];
}
