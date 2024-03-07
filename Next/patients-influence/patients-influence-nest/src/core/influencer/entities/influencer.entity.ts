import { Influencer } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';
import { InfluencerDiseaseAreaEntity } from './influencer-disease-area.entity';
import { InfluencerCampaignAmountEntity } from './influencer-campaign-amount.entity';
import { InfluencerSurveyAmountEntity } from './influencer-survey-amount.entity';
import { StakeholderEntity } from './stakeholder.entity';
import { Gender } from 'src/core/users/enums/gender';

export class InfluencerEntity implements Influencer {
  id: number;
  userId: number;
  invitendByUserId: number;
  stakeholderId: number;
  // @ApiHideProperty()   //!WIP protects via authentication
  // @Exclude()
  affiliateCode: string;
  gender: Gender;
  dateOfBirth: Date;
  ethnicityId: number;
  type: number;
  instagramUsername: string;
  status: number;
  verifiedSince: Date;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Transform(({ value }) =>
    value.map((item) => new InfluencerDiseaseAreaEntity(item)),
  )
  influencerDiseaseAreas?: InfluencerDiseaseAreaEntity[];
  @Transform(({ value }) =>
    value.map((item) => new InfluencerCampaignAmountEntity(item)),
  )
  influencerCampaignAmounts?: InfluencerCampaignAmountEntity[];
  @Transform(({ value }) =>
    value.map((item) => new InfluencerSurveyAmountEntity(item)),
  )
  influencerSurveyAmounts?: InfluencerSurveyAmountEntity[];
  @Transform(({ value }) => value.map((item) => new StakeholderEntity(item)))
  stakeholders?: StakeholderEntity[];

  constructor({
    influencerDiseaseAreas,
    influencerCampaignAmounts,
    influencerSurveyAmounts,
    stakeholders,
    ...data
  }: Partial<InfluencerEntity>) {
    Object.assign(this, data);

    if (influencerDiseaseAreas)
      this.influencerDiseaseAreas = influencerDiseaseAreas;
    if (influencerCampaignAmounts)
      this.influencerCampaignAmounts = influencerCampaignAmounts;
    if (influencerSurveyAmounts)
      this.influencerSurveyAmounts = influencerSurveyAmounts;
    if (stakeholders) this.stakeholders = stakeholders;
  }
}
