export type TRegisterAsInfluencerParams = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  affiliateCode?: string;
};

export type TSingleInfluencer = {
  id: number;
};

// Za brisanje

export type TAffiliatedInfluencer = {
  id: number;
  stakeholderId: number;
  affiliateCode: string;
  gender: number;
  dateOfBirth: Date;
  userId: number;
  ethnicityId: number;
  type: number;
  createdAt: Date;
  updatedAt: Date;
  invitendByUserId: number;
  user: {
    firstName: string;
    lastName: string;
    id: number;
  };
};

export interface IInfluencer {
  id: number;
  userId: number;
  invitendByUserId: number | null;
  stakeholderId: number | null;
  affiliateCode: string;
  gender: number | null;
  dateOfBirth: string | null;
  ethnicityId: number | null;
  type: any;
  invitedByUser: any | null;
  platformProductOrderInfluencers: any[];
  influencerDiseaseAreas: IInfluencerDiseaseArea[];
  influencerCampaignAmounts: IInfluencerCampaignAmount[];
  influencerSurveyAmounts: IInfluencerSurveyAmount[];
  stakeholders: IStakeholder[];
  verifiedSince: Date | null;
  instagramUsername: string;
}

export interface IStakeholder {
  id: number;
  socialPlatformId: number;
  socialPlatformUserId: string;
  socialPlatformUsername: string;
  iv: any;
  bio: string;
  type: number;
  isRegistered: boolean;
  isSML: boolean;
  isQA: boolean;
  isPrivate: boolean;
  followersCount: number;
  influencerId: number;
  locationId: number;
  ethnicityId: number;
  gender: number;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

export interface IInfluencerDiseaseArea {
  id: number;
  influencerId: number;
  diseaseAreaId: number;
  diseaseArea: IDiseaseArea;
  createdAt: string;
  updatedAt: string;
}

export interface IDiseaseArea {
  id: number;
  name: string;
  isCommon: boolean;
  parentDiseaseAreaId: number;
  createdAt: string;
  updatedAt: string;
}
export interface IInfluencerCampaignAmount {
  id: number;
  influencerId: number;
  postType: number;
  desiredAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IInfluencerSurveyAmount {
  id: number;
  influencerId: number;
  surveyType: number;
  desiredAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ILocation {
  id: number;
  name: string;
  isCommon: boolean;
  countryId: number;
  createdAt: string;
  updatedAt: string;
  country?: ICountry;
}

export interface ICountry {
  id: number;
  name: string;
  isCommon: boolean;
  countryId: any;
  createdAt: string;
  updatedAt: string;
}

//

export interface IPaginatedResults {
  data: IPaginatedUser[];
  pagination: Pagination;
}

export interface IPaginatedUser {
  id: number;
  influencerId: number;
  user: User;
  invitedByUser?: IInvitedByUser;
  gender?: number;
  dateOfBirth?: string;
  influencerCampaignAmounts: InfluencerCampaignAmount[];
  influencerSurveyAmounts: InfluencerSurveyAmount[];
  stakeholders: Stakeholder[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: number;
  currency: number;
  createdAt: string;
  updatedAt: string;
  assigneeUserLabels: any[];
  location?: IPaginatedLocation;
}

export interface IPaginatedLocation {
  id: number;
  name: string;
  country: IPaginatedCountry;
}

export interface IPaginatedCountry {
  id: number;
  name: string;
}

export interface IInvitedByUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface InfluencerCampaignAmount {
  _count: Count;
}

export interface Count {
  desiredAmountChangelog: number;
}

export interface InfluencerSurveyAmount {
  _count: Count2;
}

export interface Count2 {
  desiredAmountChangelog: number;
}

export interface Stakeholder {
  patientCaregiverDiseaseAreas: PatientCaregiverDiseaseArea[];
  gender: number;
  dateOfBirth: string;
  socialPlatform: SocialPlatform;
}

export interface PatientCaregiverDiseaseArea {
  diseaseArea: DiseaseArea;
}

export interface DiseaseArea {
  id: number;
  name: string;
  parentDiseaseArea: ParentDiseaseArea;
}

export interface ParentDiseaseArea {
  id: number;
  name: string;
}

export interface SocialPlatform {
  id: number;
  name: string;
}

export interface Pagination {
  totalItems: number;
  totalFilteredItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

// Get Regular Influencers (NOT DISCOVER INFLUENCERS RESPONSE)

export interface IGetInfluencersPaginationResponse {
  data: any;
  pagination: IPagination;
  dataFormatted: IInfluencerUser[];
}

export interface IPagination {
  totalItems: number;
  totalFilteredItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  nextCursor: number;
  itemCountReal: number;
}

export interface IInfluencerUser {
  user: IUser;
  id: number;
  influencerId: number;
  experienceAs: number;
  socialMedia?: number;
  username?: string;
  diseaseAreas: IDiseaseAreaRegular[];
  location: ILocationRegular;
  ethnicity: IEthnicityRegular;
  followers?: number;
  postAmount: number;
  reelAmount?: number;
  storyAmount?: number;
  questionCreditAmount?: number;
  longInterviewAmount?: number;
  shortInterviewAmount?: number;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: number;
}

export interface IDiseaseAreaRegular {
  id: number;
  name: string;
  parentDiseaseArea: IParentDiseaseArea;
}

export interface IParentDiseaseArea {
  id?: number;
  name?: string;
}

export interface ILocationRegular {
  id: number;
  name: string;
  country: ICountryRegular;
}

export interface ICountryRegular {
  id: number;
  name: string;
}

export interface IEthnicityRegular {
  id: number;
  name: string;
}
