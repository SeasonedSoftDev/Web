import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { PlatformProductOrderComment } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { UserCommentUserEntity } from './user-comment-user.entity';
import { UserEntity } from 'src/core/users/entities/user.entity';

export class ProductOrderCommentEntity implements PlatformProductOrderComment {
  id: number;

  @ApiProperty({ example: 'Was going smooth.' })
  comment: string;

  userId: number;

  @ApiHideProperty()
  @Exclude()
  productOrderId: number;

  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;

  user?: UserCommentUserEntity;

  constructor({ user, ...data }: Partial<ProductOrderCommentEntity>) {
    Object.assign(this, data);

    if (user) this.user = new UserEntity(user);
  }
}
