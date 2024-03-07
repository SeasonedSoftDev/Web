import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { ApiProperty } from '@nestjs/swagger';
import { SurveyEntity } from './survey.entity';

export class SurveyPaginationEntity extends PaginationResult<SurveyEntity> {
  @ApiProperty({ type: [SurveyEntity] })
  result: SurveyEntity[];
}
