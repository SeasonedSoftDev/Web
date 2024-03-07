import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import {
  Hash,
  UserRole,
  TCreateSeedStateOption,
  getRandomArrayLength,
} from '../../../../src/utils';

export type TCreateClients = {
  count: number;
  users: TCreateSeedStateOption;
  locations: TCreateSeedStateOption;
  companies: TCreateSeedStateOption;
  companyTitles: TCreateSeedStateOption;
  diseaseAreas: TCreateSeedStateOption;
  currencies: TCreateSeedStateOption;
};

export const createClients = async ({
  count,
  users,
  locations,
  companies,
  companyTitles,
  diseaseAreas,
  currencies,
}: TCreateClients) => {
  const clients = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const status = faker.number.int(7);

    clients.push({
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: await Hash('Password123.'),
      role: UserRole.Client,
      locationId: locations.getRandom().id,
      status,
      client: {
        create: {
          companyId: companies.getRandom().id,
          companyTitleId: companyTitles.getRandom().id,
          ambassadorId: faker.helpers.arrayElement([
            users.getRandom((u) => u.role === UserRole.Ambassador).ambassador
              .id,
            undefined,
          ]),
          clientDiseaseAreas: {
            createMany: {
              data: getRandomArrayLength(5).map(() => ({
                diseaseAreaId: diseaseAreas.getRandom().id,
              })),
              skipDuplicates: true,
            },
          },
          clientMarkets: {
            createMany: {
              data: getRandomArrayLength(5).map(() => ({
                locationId: locations.getRandom().id,
              })),
              skipDuplicates: true,
            },
          },
          platformProductOrder: {
            createMany: {
              data: getRandomArrayLength(5).map(() => ({
                platformProduct: faker.number.int({ min: 0, max: 4 }),
                budget: faker.number.int({ min: 1000, max: 10000 }),
                currencyId: currencies.getRandom().id,
                ambassadorCommission: new Prisma.Decimal(0.0125),
                status: 0,
              })),
              skipDuplicates: true,
            },
          },
        },
      },
    });
  }

  return clients;
};
