import { DiscoverClient } from '@prisma/client';

export const generateInvitationLink = (
  baseUrl: string,
  discoverClient: DiscoverClient,
) => {
  /*
    /register?as=client&ref=<UUID>
  */
  // * en-US is the default!
  const invitationLink = `${baseUrl}/register?as=client&affiliateCode=${discoverClient.invitationToken}`;

  return invitationLink;
};
