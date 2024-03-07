import { QuestionType } from './enums';

export type TCreateSurveyParams = {
  companyId?: string;
  ambassadorId?: string;
  name: string;
  type: string;
  startDate: string;
  finishDate: string;
  language: string;
  budget: number;
  info: string;
  numberOfParticipants: number;
  numberOfQuestions: number;
  diseaseArea: string;
  minAge: number;
  maxAge: number;
  gender: string;
  targetAudienceInfo: string;
  link?: string;
  materials?: string;
  survey?: string;
};

export interface IDeleteManySurveyBody {
  surveyIds: number[];
}

// single survey response

export interface ISingleSurveyResponse {
  id: number;
  name: string;
  platformProductOrderId: number;
  dateStart: string;
  dateEnd: string;
  language: any;
  surveyDescription: any;
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
  products: IProduct[];
  surveyQuestions: any[];
  clientSurveyTokenBalances: IClientSurveyTokenBalance[];
  stakeholderTypes: any[];
  exampleImages: any[];
  platformProductOrder: IPlatformProductOrder;
}

export interface IProduct {
  product: IProduct2;
}

export interface IProduct2 {
  id: number;
  name: string;
  genericName: string;
  createdByClientId: any;
  isApproved: boolean;
  isBranded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IClientSurveyTokenBalance {
  id: number;
  surveyId: number;
  chatMessageId: any;
  tokenBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPlatformProductOrder {
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
  platformProductOrderDiseaseAreas: any[];
  platformProductOrderEthnicities: any[];
  platformProductOrderGenders: any[];
  platformProductOrderInterests: any[];
  platformProductOrderLocations: any[];
  platformProductOrderStruggles: any[];
  platformProductOrderSymptoms: any[];
  platformProductOrderLabels: any[];
  platformProductOrderLanguages: any[];
  platformProductOrderInfluencers: IPlatformProductOrderInfluencer[];
}

export interface IClient {
  id: number;
  userId: number;
  companyId: number;
  companyTitleId: number;
  industryId: any;
  ambassadorId: any;
  createdAt: string;
  updatedAt: string;
  user: IUser;
  ambassador: any;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
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
  influencer: IInfluencer;
}

export interface IInfluencer {
  stakeholders: IStakeholder[];
  user: IUser2;
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

export interface IUser2 {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailResendTokens: number;
  password: string;
  locationId: number;
  role: number;
  status: number;
  isDeleted: boolean;
  currency: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateQuestionBody {
  questionText: string;
  questionType: QuestionType;
  order?: number;
  questionCredit?: number;
  isOptional?: boolean;
}

export interface IUpdateQuestionBody {
  questionText?: string;
  questionType: QuestionType;
  order?: number;
  questionCredit?: number;
  isOptional?: boolean;
}

export interface ICreateQuestionResponse {
  id: number;
  surveyId: number;
  questionText: string;
  questionType: number;
  order: any;
  questionCredit: number;
  isOptional: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IApproveDisaproveInfluencersBody {
  influencerIds: number[];
}

// export interface ISurveyQuestionChartResponse {
//   dateOfBirth: IBubbleChartGraph[];
//   ethnicity: IBubbleChartGraph[];
//   gender: IBubbleChartGraph[];
// }

export interface ISurveyQuestionChartResponse {
  [key: string]: IBubbleChartGraph[];
}
export interface IBubbleChartGraph {
  x: number;
  y: number;
  r: number;
  userFullName: string;
  optionText: string;
}

// Response For Survey Demographics Data

export interface ISurveyDemographicsData {
  ageAndGenderGraph: IAgeAndGenderGraph;
  countriesGraph: ICountriesGraph;
  stakeholderGraph: IStakeholderGraph;
  ethnicitiesGraph: IEthnicitiesGraph;
  diseasesGraph: IDiseasesGraph;
}

export interface IAgeAndGenderGraph {
  graphLabels: string[];
  maleCountData: number[];
  femaleCountData: number[];
  otherCountData: number[];
}

export interface ICountriesGraph {
  graphLabels: string[];
  influencerCountryData: number[];
}

export interface IStakeholderGraph {
  graphLabels: string[];
  influencerStakeholderData: number[];
}

export interface IEthnicitiesGraph {
  graphLabels: string[];
  influencerEthnicityData: number[];
}

export interface IDiseasesGraph {
  graphLabels: string[];
  influencerDiseaseData: number[];
}

// End Response For Survey Demographics Data
