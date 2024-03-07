import { PlatformProductOrderLabel } from '@prisma/client';
import { Type } from 'class-transformer';
import { LabelEntity } from 'src/core/common/labels/entities/label.entity';
import { PlatformProductOrderEntity } from 'src/core/platform-product/entities';
import { UserEntity } from 'src/core/users/entities/user.entity';

export class ProductOrderLabelEntity implements PlatformProductOrderLabel {
  id: number;
  labelId: number;
  assignerId: number;
  platformProductOrderId: number;
  createdAt: Date;
  updatedAt: Date;

  @Type(() => LabelEntity)
  label: LabelEntity;
  @Type(() => UserEntity)
  assignerUser: UserEntity;
  @Type(() => PlatformProductOrderEntity)
  platformProductOrder: PlatformProductOrderEntity;

  constructor({
    label,
    assignerUser,
    platformProductOrder,
    ...data
  }: Partial<ProductOrderLabelEntity>) {
    Object.apply(this, data);

    if (label) this.label = label;
    if (assignerUser) this.assignerUser = assignerUser;
    if (platformProductOrder) this.platformProductOrder = platformProductOrder;
  }
}
