import { UserLabel } from '@prisma/client';
import { Type } from 'class-transformer';
import { LabelEntity } from 'src/core/common/labels/entities/label.entity';
import { UserEntity } from 'src/core/users/entities/user.entity';

export class UserLabelEntity implements UserLabel {
  id: number;
  labelId: number;
  assignerId: number;
  assigneeId: number;
  createdAt: Date;
  updatedAt: Date;

  @Type(() => LabelEntity)
  label: LabelEntity;
  @Type(() => UserEntity)
  assignerUser: UserEntity;
  @Type(() => UserEntity)
  assigneeUser: UserEntity;

  constructor({
    label,
    assignerUser,
    assigneeUser,
    ...data
  }: Partial<UserLabelEntity>) {
    Object.apply(this, data);

    if (label) this.label = label;
    if (assignerUser) this.assignerUser = assignerUser;
    if (assigneeUser) this.assigneeUser = assigneeUser;
  }
}
