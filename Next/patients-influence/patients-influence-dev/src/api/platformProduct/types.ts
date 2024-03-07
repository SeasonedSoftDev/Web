export interface IPlatformCampaignInfluencerPaginationResponse {
  meta: IMeta;
  result: IPlatformCampaignInfluencers[];
}

export interface IMeta {
  skip: number;
  limit: number;
  countTotal: number;
  countFiltered: number;
}

export interface IPlatformCampaignInfluencers {
  id: number;
  productOrderId: number;
  influencerId: number;
  agreedAmount: number;
  currency: number;
  status: number;
  signedAt: any;
  createdAt: string;
  updatedAt: string;
  influencer: ICampaignInfluencers;
}

export interface ICampaignInfluencers {
  id: number;
  userId: number;
  invitendByUserId: any;
  stakeholderId: any;
  affiliateCode: string;
  gender: number;
  dateOfBirth: string;
  ethnicityId: number;
  type: number;
  createdAt: string;
  updatedAt: string;
  user: ICampaignUser;
  stakeholders: ICampaignStakeholders[];
  influencerDiseaseAreas: ICampaignInfluencerDiseaseArea[];
  campaignInfluencerPerformances: ICampaignInfluencerPerformance[];
}

export interface ICampaignInfluencerPerformance {
  id: number;
  campaignId: number;
  influencerId: number;
  submissionLink: string;
  trackingCode: any;
  postTimestamp: any;
  comments: any;
  likes: any;
  costPerTarget: any;
  costPerClick: any;
  reach: any;
  engagement: any;
  websiteClick: any;
  overlap: any;
  createdAt: string;
  updatedAt: string;
}

interface ICampaignInfluencerDiseaseArea {
  id: number;
  diseaseAreaId: number;
  diseaseArea: ICampaignDiseaseArea;
}

interface ICampaignDiseaseArea {
  id: number;
  name: string;
  parentDiseaseArea?: ICampaignParentDiseaseArea;
}

interface ICampaignParentDiseaseArea {
  id: number;
  name: string;
}
interface ICampaignStakeholders {
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

export interface ICampaignUser {
  id: number;
  firstName: string;
  lastName: string;
  currency: number;
  isDeleted: boolean;
  role: number;
  status: number;
}

export interface ISingleProductOrderCampaign {
  id: number;
  name: string;
  platformProductOrderId: number;
  dateStart: string;
  dateEnd: string;
  description: any;
  influencersCount: number;
  ageMin: any;
  ageMax: any;
  targetAudienceDescription: any;
  socialPlatformId: number;
  postType: number;
  clientCompanyWebsite: any;
  instructions?: string;
  contract: any;
  isContractApproved: boolean;
  report: number;
  createdAt: string;
  updatedAt: string;
  platformProductOrder: IPlatformProductOrderCampaign;
}

export interface ISingleProductOrderSurvey {
  id: number;
  name: string;
  platformProductOrderId: number;
  dateStart: string;
  dateEnd: string;
  language: string;
  surveyDescription: string;
  participantCount: number;
  questionCount: number;
  ageMin: any;
  ageMax: any;
  participantsDescription: any;
  surveyType: number;
  fileUploadUrl: any;
  instructionsDescription: any;
  questionCredits: any;
  link: any;
  contract: any;
  isContractApproved: boolean;
  createdAt: string;
  updatedAt: string;
  platformProductOrder: IPlatformProductOrderCampaign;
}

interface IPlatformProductOrderCampaign {
  id: number;
  platformProduct: number;
  clientId: number;
  status: number;
  currencyId: number;
}

// Platform Product Order Survey

export interface IPlatformSurveyInfluencerPaginationResponse {
  meta: IMeta;
  result: IPlatformSurveyInfluencers[];
}

export interface IPlatformSurveyInfluencers {
  id: number;
  productOrderId: number;
  influencerId: number;
  agreedAmount: number;
  currency: number;
  status: number;
  signedAt: any;
  createdAt: string;
  updatedAt: string;
  influencer: ISurveyInfluencer;
}

export interface ISurveyInfluencer {
  id: number;
  userId: number;
  invitendByUserId: any;
  stakeholderId: any;
  affiliateCode: string;
  gender: number;
  dateOfBirth: string;
  ethnicityId: number;
  type: number;
  createdAt: string;
  updatedAt: string;
  user: IUser;
  stakeholders: IStakeholder[];
  influencerDiseaseAreas: IInfluencerDiseaseArea[];
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: number;
  location: ILocation;
}

export interface ILocation {
  id: number;
  name: string;
  country: ICountry;
}

export interface ICountry {
  id: number;
  name: string;
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
  diseaseAreaId: number;
  diseaseArea: IDiseaseArea;
}

export interface IDiseaseArea {
  id: number;
  name: string;
  parentDiseaseArea?: IParentDiseaseArea;
}

export interface IParentDiseaseArea {
  id: number;
  name: string;
}
