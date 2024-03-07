import { Stakeholder } from '@prisma/client';
import { SocialPlatform } from 'src/core/stakeholders/enums/social-platform.enum';
import { Gender } from 'src/core/users/enums/gender';
import { StakeholderType } from 'src/utils/enums/stakeholder-type.enum';

export class LabelTableResponseEntity {
  id: number;
  name: string;

  constructor(data: Partial<LabelTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class AmbassadorTableResponseEntity {
  id: number;
  firstName: string;
  lastName: string;
  email: string;

  constructor(data: Partial<AmbassadorTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class CompanyTableResponseEntity {
  id: number;
  name: string;

  constructor(data: Partial<CompanyTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class IndustryTableResponseEntity {
  id: number;
  name: string;

  constructor(data: Partial<IndustryTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class ProductTableResponseEntity {
  id: number;
  name: string;

  constructor(data: Partial<ProductTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class LocationTableResponseEntity {
  id: number;
  name: string;
  country: LocationTableResponseEntity;

  constructor(data: Partial<LocationTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class MarketTableResponseEntity {
  id: number;
  name: string;

  constructor(data: Partial<MarketTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class DiseaseAreaTableResponseEntity {
  id: number;
  name: string;
  parentDiseaseArea: DiseaseAreaTableResponseEntity;

  constructor(data: Partial<DiseaseAreaTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class RoleTableResponseEntity {
  id: number;
  name: string;

  constructor(data: Partial<RoleTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class UserTableResponseEntity {
  id: number;
  firstName: string;
  lastName: string;
  email: string;

  constructor(data: Partial<UserTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class EthnicityTableResponseEntity {
  id: number;
  name: string;

  constructor(data: Partial<EthnicityTableResponseEntity>) {
    Object.assign(this, data);
  }
}

class UserLimitedEntity {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: Gender;
}

export class InfluencerTableResponseEntity {
  id: number;
  influencerId: number;
  user: UserLimitedEntity;
  experienceAs: StakeholderType;
  socialMedia: SocialPlatform;
  username: string;
  verifiedSince: Date;
  diseaseAreas: DiseaseAreaTableResponseEntity[];
  location: LocationTableResponseEntity;
  invitedBy: UserTableResponseEntity;
  invited: UserTableResponseEntity[]; // other influencers
  ethnicity: EthnicityTableResponseEntity;
  followers: number;
  labels: LabelTableResponseEntity[];
  registeredAt: Date;
  postAmount: number;
  reelAmount: number;
  storyAmount: number;
  questionCreditAmount: number;
  shortInterviewAmount: number;
  longInterviewAmount: number;
  patientCaregiverRatio: number;
  doctorRatio: number;
  nurseRatio: number;
  targetedDieaseAreasRatio: number;
  targetedSymptomsRatio: number;
  targetedStrugglesRatio: number;
  targetedGenderRatio: number;
  targetedAgeRatio: number;
  targetedEthnicityRatio: number;
  targetRatio: number;
  targetTotal: number;
  averageLikes: number;
  averageComments: number;
  engagement: number;
  targetedLocationRatio: number;

  constructor(data: Partial<InfluencerTableResponseEntity>) {
    Object.assign(this, data);
  }
}
