import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { UserEntity } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserPaginationResult extends PaginationResult<UserEntity> {
  @ApiProperty({ type: [UserEntity] })
  result: UserEntity[];
}
