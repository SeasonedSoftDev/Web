import { Influencer } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { Gender } from 'src/core/users/enums/gender';
import { UserAffiliateReturnDto } from 'src/core/influencer/dto/user-affiliate-return.dto';

export class InfluencerAffiliatedEntity implements Influencer {
  id: number;
  stakeholderId: number;
  affiliateCode: string;
  gender: Gender;
  dateOfBirth: Date;
  instagramUsername: string;
  status: number;
  commentsCount: number;
  followersCount: number;
  likesCount: number;
  postCount: number;
  verifiedSince: Date;

  @Exclude()
  userId: number;

  @Exclude()
  ethnicityId: number;

  @Exclude()
  type: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  invitendByUserId: number;

  user: UserAffiliateReturnDto;
}
