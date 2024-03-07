import { TUserRole } from 'types/global';

export type TLoginParams = {
  email: string;
  password: string;
};

export type TLoginResponse = {
  token: string;
  role: Array<TUserRole>;
  affiliateLink: string;
  attempt: number;
};

export type TMeResponse = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    role: Array<TUserRole>;
  };
};

export type TResetPassword = {
  email: string;
};

export type TConfirmResetPassword = {
  password: string;
  token: string;
};

export type TEmailConfirmation = {
  token: string;
};

export type TResendEmailConfirmation = {
  email: string;
};
