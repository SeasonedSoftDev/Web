export interface IInfluencerCampaingResponse {
  meta: IMeta;
  result: IProductOrderCampaing[];
}

export interface IMeta {
  skip: number;
  limit: number;
  countTotal: number;
  countFiltered: number;
}

export interface IProductOrderCampaing {
  dateStart: string;
  dateEnd: string;
  name: string;
  id: number;
  platformProductOrderId: number;
  socialPlatformId: number;
  clientCompanyWebsite?: string;
  instructions?: string;
  products: IProduct[];
  postType: IPostType;
  exampleImages: IExampleImage[];
  platformProductOrder: IPlatformProductOrder;
  campaignInfluencerPerformances?: ICampaignInfluencerPerformances[];
}

export interface ICampaignInfluencerPerformances {
  id: number;
  campaignId: number;
  influencerId: number;
  submissionLink: string;
}

export interface IProduct {
  id: number;
  campaignId: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
  product: IProduct2;
}

export interface IProduct2 {
  id: number;
  name: string;
  genericName: string;
}

export interface IPostType {
  name: string;
  value: number;
}

export interface IExampleImage {
  id: number;
  campaignId: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPlatformProductOrder {
  id: number;
  clientId: number;
  client: IClient;
  platformProduct: number;
  status: number;
  platformProductOrderInfluencers: IPlatformProductOrderInfluencer[];
}

export interface IClient {
  id: number;
  clientProducts: any[];
  company: ICompany;
}

export interface ICompany {
  id: number;
  name: string;
}

export interface IPlatformProductOrderInfluencer {
  id: number;
  productOrderId: number;
  influencerId: number;
  agreedAmount: number;
  currency: number;
  status: number;
  signedAt: any;
  createdAt: string;
  updatedAt: string;
}
