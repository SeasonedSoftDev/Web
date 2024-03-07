import { Prisma } from '@prisma/client';

const stakeholderId = Prisma.validator<Prisma.StakeholderArgs>()({
  select: { id: true },
});

export type TStakeholderWithId = Prisma.StakeholderGetPayload<
  typeof stakeholderId
>;
