import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { ApiProperty } from '@nestjs/swagger';
import { UserLabelEntity } from './user-label.entity';

export class UserLabelPaginationEntity extends PaginationResult<UserLabelEntity> {
  @ApiProperty({ type: [UserLabelEntity] })
  result: UserLabelEntity[];
}
