import {
  IInfluencer,
  ILocation,
  TAffiliatedInfluencer,
} from 'api/influencer/types';

export type TCreateUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  locationId: string;
  role: string;
  status: string;
  isDeleted: boolean;
  currency: string;
  createAt: string;
  updatedAt: string;
};

export type TSingleUser = {
  id: string;
};

export type TAddComment = {
  comment: string;
};

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailResendTokens: number;
  locationId: number | null;
  role: number;
  status: number;
  currency: number;
  createdAt: string;
  updatedAt: string;
  assigneeUserLabels: any[];
  productOrderChatRoomMember: any[];
  notificationUsers: any[];
  invitedInfluencers: TAffiliatedInfluencer[];
  influencer: IInfluencer;
  location?: ILocation;
}
