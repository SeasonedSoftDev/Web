import { User, Influencer, Ambassador } from '@prisma/client';
import { UserRole } from '../enums';

export const generateAffiliateLink = (
  baseUrl: string,
  user: User & { influencer?: Influencer; ambassador?: Ambassador },
) => {
  /*
    /register?as=client&ref=<UUID>
    /register?as=influencer&ref=<UUID>
    /register?as=&ref=
  */
  // * en-US is the default!
  const affiliateLink = `${baseUrl}/register?as=${
    // * role
    user.role === UserRole.Ambassador
      ? 'client'
      : user.role === UserRole.Influencer
      ? 'influencer'
      : ''
  }&affiliateCode=${
    // * affiliate code
    user.role === UserRole.Ambassador
      ? user.ambassador.affiliateCode
      : user.role === UserRole.Influencer
      ? user.influencer.affiliateCode
      : ''
  }`;

  return affiliateLink;
};
