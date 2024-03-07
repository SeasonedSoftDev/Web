export type TCreateCompany = {
  isCommon: boolean;
  isApproved: boolean;
  name: string;
  createByUserId: number;
};

export type TCreateCompanyTitle = {
  name: string;
};

export type TSingleCompany = {
  id: string;
};

export type TSingleCompanyTitle = {
  id: string;
};

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
