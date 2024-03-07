export interface IUserAmbassador {
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
}

export interface ISelectFieldType {
  value: number;
  label: string;
}
