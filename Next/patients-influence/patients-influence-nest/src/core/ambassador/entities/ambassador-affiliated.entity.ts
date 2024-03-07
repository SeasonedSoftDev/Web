import { Ambassador } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { UserAffiliateReturnDto } from 'src/core/influencer/dto/user-affiliate-return.dto';

export class AmbassadorAffiliatedEntity implements Ambassador {
  id: number;
  userId: number;
  affiliateCode: string;

  @Exclude()
  dateOfBirth: Date;

  @Exclude()
  companyId: number;

  @Exclude()
  companyTitleId: number;

  @Exclude()
  industryId: number | null;

  @Exclude()
  invitedByAdminId: number;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdAt: Date;

  user: UserAffiliateReturnDto;
}
