import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { LocationEntity } from './location.entity';
import { ApiProperty } from '@nestjs/swagger';

export class LocationPaginationEntity extends PaginationResult<LocationEntity> {
  @ApiProperty({ type: [LocationEntity] })
  result: LocationEntity[];
}
