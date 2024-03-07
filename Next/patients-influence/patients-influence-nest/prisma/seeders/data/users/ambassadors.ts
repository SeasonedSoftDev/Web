import { faker } from '@faker-js/faker';
import {
  Hash,
  UserRole,
  TCreateSeedStateOption,
  UserStatus,
  generateAffiliateCode,
} from '../../../../src/utils';

export type TCreateAmbassadors = {
  count: number;
  users: TCreateSeedStateOption;
  locations: TCreateSeedStateOption;
  companies: TCreateSeedStateOption;
  companyTitles: TCreateSeedStateOption;
};

export const createAmbassadors = async ({
  count,
  users,
  locations,
  companies,
  companyTitles,
}: TCreateAmbassadors) => {
  const ambassadors = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    ambassadors.push({
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: await Hash('Password123.'),
      role: UserRole.Ambassador,
      locationId: locations.getRandom().id,
      status: UserStatus.Confirmed,
      ambassador: {
        create: {
          affiliateCode: generateAffiliateCode(),
          invitedByAdminId: users.getRandom((x) =>
            [UserRole.Admin, UserRole.SuperAdmin].includes(x.role),
          ).admin.id,
          companyId: companies.getRandom().id,
          companyTitleId: companyTitles.getRandom().id,
        },
      },
    });
  }

  return ambassadors;
};
