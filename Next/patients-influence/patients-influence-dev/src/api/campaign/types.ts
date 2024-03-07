export type TUpdateCampaign = {
  budget?: number;
  status?: number;
  name?: string;
  clientId?: number;
  currencyId?: number;
  diseaseAreaIds?: number[];
  stakeholderTypes?: number[];
  struggleIds?: number[];
  symptomIds?: number[];
  locationIds?: number[];
  languages?: number[];
  ethnicityIds?: number[];
  interestIds?: number[];
  productIds?: number[];
  dateStart?: Date;
  dateEnd?: Date;
  description?: string;
  influencersCount?: number;
  influencersSizeIds?: number[];
  ageMin?: number;
  ageMax?: number;
  genders?: number[];
  targetAudienceDescription?: string;
  socialPlatformId?: number;
  postType?: number;
  exampleImageUrls?: string[];
  clientCompanyWebsite?: string;
  instructions?: string;
  report?: number;
};

export type TCampaign = {
  id?: number;
  name?: string;
  platformProductOrderId?: number;
  campaignReport?: any;
  dateStart?: null;
  dateEnd?: null;
  description?: string;
  influencersCount?: number;
  ageMin?: number;
  ageMax?: number;
  targetAudienceDescription?: string;
  socialPlatformId?: number;
  postType?: PostType;
  clientCompanyWebsite?: null;
  instructions?: null;
  contract?: null;
  isContractApproved?: boolean;
  report?: PostType;
  createdAt?: Date;
  updatedAt?: Date;
  campaignInfluencersSizes?: CampaignInfluencersSize[];
  products?: ProductElement[];
  stakeholderTypes?: PostType[];
  exampleImages?: any[];
  platformProductOrder?: PlatformProductOrder;
};

export type CampaignInfluencersSize = {
  influencerSize?: InfluencerSize;
  influencerSizeId?: number;
};

export type InfluencerSize = {
  id?: number;
  name?: string;
  from?: number;
  to?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PlatformProductOrder = {
  id?: number;
  clientId?: number;
  platformProduct?: number;
  ambassadorCommission?: number;
  budget?: number;
  currencyId?: number;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
  client?: Client;
  currency?: Currency;
  platformProductOrderDiseaseAreas?: PlatformProductOrderDiseaseArea[];
  platformProductOrderEthnicities?: PlatformProductOrderEthnicity[];
  platformProductOrderGenders?: PostType[];
  platformProductOrderLanguages?: PostType[];
  platformProductOrderInterests?: PlatformProductOrderInterest[];
  platformProductOrderLocations?: PlatformProductOrderLocation[];
  platformProductOrderStruggles?: PlatformProductOrderStruggle[];
  platformProductOrderSymptoms?: PlatformProductOrderSymptom[];
  platformProductOrderLabels?: any[];
  platformProductOrderInfluencers?: PlatformProductOrderInfluencer[];
  platformProductOrderChatRooms?: PlatformProductOrderChatRooms[];
};

export interface PlatformProductOrderChatRooms {
  createdAt: string;
  id: number;
  isGroupRoom: true;
  productOrderId: number;
  updatedAt: string;
  productOrderChatRoomMembers: PlatformProductOrderChatRoomMembers[];
}

export interface PlatformProductOrderChatRoomMembers {
  createdAt: string;
  id: number;
  productOrderChatRoomId: number;
  userId: number;
  user: User;
  updatedAt: string;
}

export interface PlatformProductOrderInfluencer {
  id: number;
  productOrderId: number;
  influencerId: number;
  agreedAmount: number;
  currency: number;
  status: number;
  signedAt: any;
  createdAt: string;
  updatedAt: string;
  influencer: Influencer;
}

export interface Influencer {
  stakeholders: Stakeholder[];
  campaignInfluencerPerformances: CampaignInfluencerPerformances[];
  user: User3;
}

export interface CampaignInfluencerPerformances {
  submissionLink: string;
}

export interface Stakeholder {
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

export interface User3 {
  id: number;
  firstName: string;
  lastName: string;
  currency: number;
  isDeleted: boolean;
  role: number;
  status: number;
}

export type Client = {
  id?: number;
  userId?: number;
  companyId?: number;
  companyTitleId?: number;
  industryId?: null;
  ambassadorId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
  company?: Company;
  ambassador?: Ambassador;
};

export type Ambassador = {
  id?: number;
  userId?: number;
  companyId?: number;
  companyTitleId?: number;
  affiliateCode?: string;
  invitedByAdminId?: number;
  industryId?: null;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
};

export type User = {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type Company = {
  id?: number;
  name?: string;
  createdByUserId?: null;
  isCommon?: boolean;
  isApproved?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Currency = {
  id?: number;
  code?: string;
};

export type PlatformProductOrderDiseaseArea = {
  diseaseArea?: DiseaseArea;
};

export type DiseaseArea = {
  id?: number;
  name?: string;
  isCommon?: boolean;
  parentDiseaseAreaId?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PlatformProductOrderEthnicity = {
  ethnicity?: Ethnicity;
};

export type Ethnicity = {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PostType = {
  name?: string;
  value?: number;
};

export type PlatformProductOrderInterest = {
  interest?: Ethnicity;
};

export type PlatformProductOrderLocation = {
  location?: Location;
};

export type Location = {
  id?: number;
  name?: string;
  isCommon?: boolean;
  countryId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  country?: Location;
};

export type PlatformProductOrderStruggle = {
  struggle?: Ethnicity;
};

export type PlatformProductOrderSymptom = {
  symptom?: Ethnicity;
};

export type ProductElement = {
  product?: ProductProduct;
};

export type ProductProduct = {
  id?: number;
  name?: string;
  genericName?: string;
  createdByClientId?: null;
  isApproved?: boolean;
  isBranded?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TSingleCampaign = {
  id: number;
};

export type TSubmissionLinkForCampaign = {
  submissionLink: string;
};

export type TApproveOrDenyInfluencersForCampaign = {
  influencerIds: number[];
};

export type TReport = {
  budget: number;
  reportType: number;
  description: string;
  reach: boolean;
  numOfLikes: boolean;
  numOfComments: boolean;
  websiteClicks: boolean;
  engagement: boolean;
  costPerClick: boolean;
  costPerLike: boolean;
  costPerComment: boolean;
  costPerEngagement: boolean;
  overlap: boolean;
};

export type TReportId = {
  reportId: number;
};

export type TUpdateReport = {
  budget?: number;
  reportType?: number;
  description?: string;
  websiteClicks?: boolean;
  engagement?: boolean;
  costPerClick?: boolean;
  costPerLike?: boolean;
  costPerComment?: boolean;
  costPerEngagement?: boolean;
  overlap?: boolean;
};

export interface IDeleteCampaignsBody {
  campaignIds: number[];
}

export interface IDeleteCampaignReportsBody {
  reportIds: number[];
}

export interface IDeleteCampaingInfluencersBody {
  influencerIds: number[];
}

// Paginated Campaign Reports
/**
 * Response for Campaign Reports in pagination format
 */
export interface IPaginatedCampaignReportsResponse {
  meta: IMeta;
  result: ICampaignReport[];
}

export interface IMeta {
  skip: number;
  limit: number;
  countTotal: number;
  countFiltered: number;
}

export interface ICampaignReport {
  id: number;
  platformProductOrderId: number;
  campaignId: number;
  reportType: number;
  status: number;
  description?: string;
  reach: boolean;
  numOfLikes: boolean;
  numOfComments: boolean;
  websiteClicks: any;
  engagement: any;
  costPerTarget: any;
  costPerClick: any;
  costPerLike: any;
  costPerComment: any;
  costPerEngagement: any;
  overlap: any;
  createdAt: string;
  updatedAt: string;
  platformProductOrder: IPlatformProductOrder;
  campaign: ICampaign;
}

export interface IPlatformProductOrder {
  id: number;
  clientId: number;
  platformProduct: number;
  ambassadorCommission: any;
  budget?: number;
  currencyId: any;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICampaign {
  id: number;
  name: string;
  platformProductOrderId: number;
  dateStart: string;
  dateEnd: string;
  description?: string;
  influencersCount: any;
  ageMin?: number;
  ageMax?: number;
  targetAudienceDescription: any;
  socialPlatformId?: number;
  postType?: PostType;
  clientCompanyWebsite?: string;
  instructions: any;
  contract: any;
  isContractApproved: boolean;
  report?: IReport;
  createdAt: string;
  updatedAt: string;
  campaignInfluencersSizes: ICampaignInfluencersSize[];
  products: IProduct[];
  platformProductOrder: IPlatformProductOrder2;
}

export interface IPostType {
  name: string;
  value: number;
}

export interface IReport {
  name: string;
  value: number;
}

export interface ICampaignInfluencersSize {
  id: number;
  campaignId: number;
  influencerSizeId: number;
  createdAt: string;
}

export interface IProduct {
  product: IProductObj;
}

export interface IProductObj {
  id: number;
  name: string;
  genericName: string;
  createdByClientId: any;
  isApproved: boolean;
  isBranded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPlatformProductOrder2 {
  id: number;
  clientId: number;
  platformProduct: number;
  ambassadorCommission: number;
  budget: number;
  currencyId: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  client: IClient;
  platformProductOrderDiseaseAreas: IPlatformProductOrderDiseaseArea[];
  platformProductOrderLocations: IPlatformProductOrderLocation[];
  platformProductOrderInfluencers: any[];
}

export interface IClient {
  id: number;
  userId: number;
  companyId: number;
  companyTitleId: number;
  industryId: any;
  ambassadorId: number;
  createdAt: string;
  updatedAt: string;
  user: IUser;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IPlatformProductOrderDiseaseArea {
  diseaseArea: IDiseaseArea;
}

export interface IDiseaseArea {
  id: number;
  name: string;
  isCommon: boolean;
  parentDiseaseAreaId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPlatformProductOrderLocation {
  location: Location;
}

export interface ILocation {
  id: number;
  name: string;
  isCommon: boolean;
  countryId: number;
  createdAt: string;
  updatedAt: string;
  country: ICountry;
}

export interface ICountry {
  id: number;
  name: string;
  isCommon: boolean;
  countryId: any;
  createdAt: string;
  updatedAt: string;
}
