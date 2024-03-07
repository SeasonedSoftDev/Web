import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/core/users/entities/user.entity';

export class UserCommentUserEntity extends PickType(UserEntity, [
  'firstName',
  'lastName',
  'email',
] as const) {}
