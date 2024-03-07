import { randomInt, randomUUID } from 'crypto';
import { faker } from '@faker-js/faker';
import { TCreateSeedStateOption } from '../../../../src/utils';

export type TCreateDiscoverClients = {
  count: number;
  locations: TCreateSeedStateOption;
  companies: TCreateSeedStateOption;
  companyTitles: TCreateSeedStateOption;
  industries: TCreateSeedStateOption;
  diseaseAreas: TCreateSeedStateOption;
};

export const createDiscoverClients = ({
  count,
  locations,
  companies,
  companyTitles,
  industries,
  diseaseAreas,
}: TCreateDiscoverClients) => {
  const discoverClients: any = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    discoverClients.push({
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }),
      locationId: locations.getRandom().id,
      companyId: companies.getRandom().id,
      invitationToken: randomUUID(),
      companyTitleId: companyTitles.getRandom().id,
      industryId: industries.getRandom().id,
      status: randomInt(0, 5),
      isDeleted: faker.datatype.boolean(),
      discoverClientMarkets: {
        createMany: {
          data: faker.helpers
            .arrayElements(locations.entities, 5)
            .map(({ id }) => ({ locationId: id })),
          skipDuplicates: true,
        },
      },
      discoverClientDiseaseAreas: {
        createMany: {
          data: faker.helpers
            .arrayElements(diseaseAreas.entities, 5)
            .map(({ id }) => ({ diseaseAreaId: id })),
          skipDuplicates: true,
        },
      },
    });
  }

  return discoverClients;
};
