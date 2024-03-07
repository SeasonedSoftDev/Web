import { Influencer, User } from '@prisma/client';

type Email = string;

type UserWithInfluencer = User & {
  influencer?: Influencer;
};

type EmailOrUserWithInfluencer = Email | UserWithInfluencer;

type AffiliateCode = string;

export { Email, UserWithInfluencer, EmailOrUserWithInfluencer, AffiliateCode };
