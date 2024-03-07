import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { ApiProperty } from '@nestjs/swagger';
import { UserCommentEntity } from '../entities/user-comment.entity';

export class UserCommentPaginationResult extends PaginationResult<UserCommentEntity> {
  @ApiProperty({ type: [UserCommentEntity] })
  result: UserCommentEntity[];
}
