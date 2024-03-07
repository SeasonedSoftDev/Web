import { Stakeholder, StakeholderPost } from '@prisma/client';
import { InfluencerEntity } from './influencer.entity';
import { Exclude } from 'class-transformer';
import { Gender } from 'src/core/users/enums/gender';

export class StakeholderEntity implements Stakeholder {
  id: number;
  socialPlatformId: number;
  socialPlatformUserId: string;
  socialPlatformUsername: string;
  iv: string;

  bio: string;
  type: number;
  isRegistered: boolean;
  isSML: boolean;
  isQA: boolean;
  isPrivate: boolean;
  followersCount: number;
  postCount: number;
  likesCount: number;
  commentsCount: number;
  influencerId: number;
  locationId: number;
  ethnicityId: number;
  gender: Gender;
  age: number;
  createdAt: Date;
  updatedAt: Date;
  influencer: InfluencerEntity;
  @Exclude()
  stakeholderPosts: StakeholderPost[];

  constructor({ influencer, ...data }: Partial<StakeholderEntity>) {
    Object.assign(this, data);
    this.influencer = influencer;
  }
}
