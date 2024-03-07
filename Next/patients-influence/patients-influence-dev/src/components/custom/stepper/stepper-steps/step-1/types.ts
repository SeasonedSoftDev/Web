import { TInputPropsOption } from 'components/ui/input/types';

export type TFormData = {
  firstname: string;
  lastName: string;
  company: string;
  role: string;
  diseaseArea: null;
  markets: string;
  email: string;
  password: string;
  invitedBy: string;
  affiliateFriends: TInputPropsOption[];
  affiliateLink: string;
};
