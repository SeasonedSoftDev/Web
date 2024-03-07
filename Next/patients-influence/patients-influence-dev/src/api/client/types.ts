export type TRegisterAsClientParams = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyId: number | null;
  companyTitleId: number | null;
  commonLegalId: number;
};

export type TSingleClient = {
  id: string;
};

// Discover Registered Clients

export interface IPaginatedDiscoverClientsResults {
  data: IDiscoverClient[];
  pagination: IPagination;
}

interface IPagination {
  totalItems: number;
  totalFilteredItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface IDiscoverClient {
  isClient: boolean;
  id: any;
  firstName: string;
  lastName: string;
  email: string;
  locationId: number;
  status: number;
  invitationToken: any;
  contactedAt: any;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  _client: IClient;
  company: ICompany;
  companyTitle: ICompanyTitle;
}

export interface IClient {
  createdAt: string;
  updatedAt: string;
  clientMarkets: IClientMarket[];
  clientDiseaseAreas: IClientDiseaseArea[];
  user: IUser;
  company: ICompany;
  companyTitle: ICompanyTitle;
  ambassador?: IAmbassador;
}

export interface IClientMarket {
  location: Location;
}

export interface ILocation {
  id: number;
  name: string;
}

export interface IClientDiseaseArea {
  diseaseArea: IDiseaseArea;
}

export interface IDiseaseArea {
  id: number;
  name: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailResendTokens: number;
  locationId: number;
  role: number;
  status: number;
  currency: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICompany {
  id: number;
  name: string;
}

export interface ICompanyTitle {
  id: number;
  name: string;
}

export interface IAmbassador {
  id: number;
  user: IUserAmbassadorInfo;
}

export interface IUserAmbassadorInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

// Get Single Client Response

export interface ISingleClientResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailResendTokens: number;
  locationId: number;
  role: number;
  status: number;
  currency: number;
  createdAt: string;
  updatedAt: string;
  client: IClientS;
  location: ILocationS;
}

export interface IClientS {
  id: number;
  userId: number;
  companyId: number;
  companyTitleId: number;
  industryId: any;
  ambassadorId: any;
  createdAt: string;
  updatedAt: string;
  clientDiseaseAreas: IClientDiseaseAreaS[];
  clientMarkets: IClientMarketS[];
  clientProducts: any[];
  industry?: IIndustry;
  company: ICompanyS;
  companyTitle: CompanyTitle;
  ambassador?: IAmbassadorS;
}

interface IAmbassadorS {
  id: number;
  userId: number;
  companyId: number;
  companyTitleId: number;
  affiliateCode: string;
  invitedByAdminId: number;
  industryId: number | null;
  createdAt: string;
  updatedAt: string;
}
interface IIndustry {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IClientDiseaseAreaS {
  id: number;
  clientId: number;
  diseaseAreaId: number;
  createdAt: string;
  updatedAt: string;
  diseaseArea: DiseaseArea;
}

export interface DiseaseArea {
  id: number;
  name: string;
  isCommon: boolean;
  parentDiseaseAreaId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IClientMarketS {
  id: number;
  clientId: number;
  locationId: number;
  createdAt: string;
  updatedAt: string;
  location: ILocationS;
}

export interface ILocationS {
  id: number;
  name: string;
  isCommon: boolean;
  countryId: number;
  createdAt: string;
  updatedAt: string;
  cities: any[];
  country: ICountryS;
}

export interface ICountryS {
  id: number;
  name: string;
  isCommon: boolean;
  countryId: any;
  createdAt: string;
  updatedAt: string;
}

export interface ICompanyS {
  id: number;
  name: string;
  createdByUserId: any;
  isCommon: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyTitle {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Paginated Clients response from /clients/table

export interface IPaginatedClientsResponse {
  data: any;
  pagination: IPaginationClients;
  dataFormatted: IPaginatedClients[];
}

export interface IPaginationClients {
  totalItems: number;
  totalFilteredItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  nextCursor: number;
}

export interface IPaginatedClients {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  registeredAt: string;
  updatedAt: string;
  labels: any[];
  clientId: number;
  ambassador: IAmbassadorPC;
  company: ICompanyPC;
  industry: IIndustryPC;
  products: IProductPC[];
  location: ILocationPC;
  markets: IMarketPC[];
  diseaseAreas: IDiseaseAreaPC[];
  role: IRolePC;
  totalBudget: number;
  totalBudgetLast30Days: number;
  totalProjects: number;
  totalOngoingProjects: number;
  totalProjectsLast30Days: number;
  averageCampaignBudget: number;
  totalCampaignBudget: number;
  totalCampaignBudgetLast30Days: number;
  totalCampaigns: number;
  totalCampaignsLast30Days: number;
  averageSurveyBudget: number;
  totalSurveyBudget: number;
  totalSurveyBudgetLast30Days: number;
  totalSurveys: number;
  totalSurveysLast30Days: number;
  averageSMLBudget: number;
  totalSMLBudget: number;
  totalSMLBudgetLast30Days: number;
  totalSMLs: number;
  totalSMLsLast30Days: number;
}

export interface IAmbassadorPC {
  id?: number;
  user?: IUserPC;
}

export interface IUserPC {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ICompanyPC {
  id: number;
  name: string;
}

export interface IIndustryPC {
  id?: number;
  name?: string;
}

export interface IProductPC {
  id: number;
  name: string;
}

export interface ILocationPC {
  id: number;
  name: string;
  country: ICountryPC;
}

export interface ICountryPC {
  id: number;
  name: string;
}

export interface IMarketPC {
  id: number;
  name: string;
}

export interface IDiseaseAreaPC {
  id: number;
  name: string;
  parentDiseaseArea: IParentDiseaseAreaPC;
}

export interface IParentDiseaseAreaPC {
  id?: number;
  name?: string;
}

export interface IRolePC {
  id: number;
  name: string;
}
