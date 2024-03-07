import { Ambassador } from '@prisma/client';
import { UserEntity } from 'src/core/users/entities/user.entity';

export class AmbassadorEntity implements Ambassador {
  id: number;
  userId: number;
  companyId: number;
  companyTitleId: number;
  affiliateCode: string;
  invitedByAdminId: number;
  industryId: number;
  createdAt: Date;
  updatedAt: Date;

  user?: UserEntity;

  constructor({ user, ...data }: Partial<AmbassadorEntity>) {
    Object.assign(this, data);

    if (user) this.user = user;
  }
}
