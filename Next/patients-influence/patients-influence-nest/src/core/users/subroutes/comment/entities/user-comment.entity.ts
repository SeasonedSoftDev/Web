import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { UserComment } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { UserCommentUserEntity } from './user-comment-user.entity';
import { UserEntity } from 'src/core/users/entities/user.entity';

export class UserCommentEntity implements UserComment {
  id: number;

  @ApiProperty({ example: 'John Doe did great in campaigns.' })
  text: string;

  userId: number;

  @ApiHideProperty()
  @Exclude()
  targetId: number;

  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;

  user?: UserCommentUserEntity;

  constructor({ user, ...data }: Partial<UserCommentEntity>) {
    Object.assign(this, data);

    if (user) this.user = new UserEntity(user);
  }
}
