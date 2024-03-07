import {
  InfluencerCampaignAmount,
  InfluencerFollowersDistributionRange,
  InfluencerSurveyAmount,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

class FollowersDistributionRange {
  count: number;
  from?: Decimal;
  to?: Decimal;

  constructor(data: Partial<InfluencerFollowersDistributionRange>) {
    Object.assign(this, data);
  }
}

class InfluencerPostTypeSetting {
  desiredAmount: Decimal;
  postType: number;

  constructor(data: Partial<InfluencerCampaignAmount>) {
    Object.assign(this, data);
  }
}

class InfluencerSurveyTypeSetting {
  desiredAmount: Decimal;
  surveyType: number;

  constructor(data: Partial<InfluencerSurveyAmount>) {
    Object.assign(this, data);
  }
}

export class DesiredAmountResultMetadata {
  followersDistributionRange?: FollowersDistributionRange;
  influencerPostTypeSetting?: InfluencerPostTypeSetting;
  influencerSurveyTypeSetting?: InfluencerSurveyTypeSetting;
  mean: Decimal;
  standardDeviation: Decimal;

  constructor({
    followersDistributionRange,
    influencerPostTypeSetting,
    influencerSurveyTypeSetting,
    ...other
  }: DesiredAmountResultMetadata) {
    Object.assign(this, other);

    if (followersDistributionRange)
      this.followersDistributionRange = new FollowersDistributionRange(
        followersDistributionRange,
      );
    if (influencerPostTypeSetting)
      this.influencerPostTypeSetting = new InfluencerPostTypeSetting(
        influencerPostTypeSetting,
      );
    else if (influencerSurveyTypeSetting)
      this.influencerSurveyTypeSetting = new InfluencerSurveyTypeSetting(
        influencerSurveyTypeSetting,
      );
  }
}
