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
