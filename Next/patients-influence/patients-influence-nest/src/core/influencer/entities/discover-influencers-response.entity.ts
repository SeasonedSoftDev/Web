import { UserStatus } from 'src/utils';

export class DiscoverInfluencersResponseEntity {
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  registeredAt: Date;
  updatedAt: Date;
  labels: {
    id: number;
    label: string;
  }[];
  invitedBy: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  gender: string; // TODO enum?
  diseaseAreas: {
    id: number;
    diseaseArea: string;
  }[];
  socialMedia: string;
  enteredDesiredAmount: boolean;
  currency: string;

  constructor(data: Partial<DiscoverInfluencersResponseEntity>) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.status = data.status;
    // this.registeredAt = data.
  }
}
