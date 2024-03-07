export type TRegisterAsAmbassadorParams = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyTitleId: number;
  invCode?: string;
  commonLegalId: number;
  company: {
    name: string;
    companyId: number;
  };
};

export type TSingleAmbassador = {
  id: number;
};

export interface ISingleAmbassadorResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailResendTokens: number;
  locationId: any;
  role: number;
  status: number;
  currency: number;
  createdAt: string;
  updatedAt: string;
  ambassador: IAmbassador;
}

export interface IAmbassador {
  id: number;
  userId: number;
  companyId: number;
  companyTitleId: number;
  affiliateCode: string;
  invitedByAdminId: number;
  industryId: any;
  createdAt: string;
  updatedAt: string;
  company: ICompany;
  companyTitle: ICompanyTitle;
  industry: any;
  clients: IClient[];
}

export interface ICompany {
  id: number;
  name: string;
  createdByUserId: any;
  isCommon: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICompanyTitle {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
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

export interface IPagintatedAmbassadors {
  meta: IMeta;
  result: IResult[];
}

export interface IMeta {
  skip: number;
  limit: number;
  countTotal: number;
  countFiltered: number;
}

export interface IResult {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailResendTokens: number;
  locationId?: number;
  role: number;
  status: number;
  currency: number;
  createdAt: string;
  updatedAt: string;
  ambassador: IPagAmbassador;
}

export interface IPagAmbassador {
  id: number;
  userId: number;
  companyId: number;
  companyTitleId: number;
  affiliateCode: string;
  invitedByAdminId: number;
  industryId: any;
  createdAt: string;
  updatedAt: string;
  company: IPagCompany;
  companyTitle: IPagCompanyTitle;
  industry: any;
  clients: IPagClient[];
  user: IAmbassadorUser;
}

export interface IAmbassadorUser {
  id: number;
  firstName: string;
  lastName: string;
  locationId?: string;
  location?: ILocationRegular;
  createdAt: string;
  updatedAt: string;
  currency: number;
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

export interface IPagCompany {
  id: number;
  name: string;
  createdByUserId: any;
  isCommon: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPagCompanyTitle {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPagClient {
  id: number;
  userId: number;
  companyId: number;
  companyTitleId: number;
  industryId: any;
  ambassadorId: number;
  createdAt: string;
  updatedAt: string;
  user: IPagUser;
}

export interface IPagUser {
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

export interface IAffiliatedAmbassador {
  id: number;
  userId: number;
  companyId: number;
  companyTitleId: number;
  affiliateCode: string;
  invitedByAdminId: number;
  industryId: any;
  createdAt: string;
  updatedAt: string;
  user: IPartUserUser;
}

export interface IPartUserUser {
  id: number;
  firstName: string;
  lastName: string;
}
