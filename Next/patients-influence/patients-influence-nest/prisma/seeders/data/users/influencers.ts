import { faker } from '@faker-js/faker';
import {
  Hash,
  UserRole,
  TCreateSeedStateOption,
  UserStatus,
  generateAffiliateCode,
  getRandomArrayLength,
} from '../../../../src/utils';

export type TCreateInfluencers = {
  count: number;
  locations: TCreateSeedStateOption;
  ethnicities: TCreateSeedStateOption;
  diseaseAreas: TCreateSeedStateOption;
};

export const createInfluencers = async ({
  count,
  ethnicities,
  locations,
  diseaseAreas,
}: TCreateInfluencers) => {
  const influencers = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const status = UserStatus[UserStatus[faker.number.int({ min: 0, max: 7 })]];

    influencers.push({
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: await Hash('Password123.'),
      role: UserRole.Influencer,
      locationId: locations.getRandom().id,
      status,
      influencer: {
        create: {
          affiliateCode: generateAffiliateCode(),
          dateOfBirth: faker.date.birthdate(),
          ethnicityId: ethnicities.getRandom().id,
          type: faker.number.int({ min: 1, max: 2 }),
          influencerCampaignAmounts: {
            createMany: {
              data: getRandomArrayLength(6).map(() => ({
                desiredAmount: faker.number.int({ min: 0, max: 300 }),
                postType: faker.number.int({ min: 0, max: 2 }),
              })),
              skipDuplicates: true,
            },
          },
          influencerSurveyAmounts: {
            createMany: {
              data: getRandomArrayLength(2).map(() => ({
                desiredAmount: faker.number.int({ min: 0, max: 300 }),
                surveyType: faker.number.int({ min: 0, max: 2 }),
              })),
              skipDuplicates: true,
            },
          },
          influencerDiseaseAreas: {
            createMany: {
              data: getRandomArrayLength(6).map(() => ({
                diseaseAreaId: diseaseAreas.getRandom().id,
              })),
              skipDuplicates: true,
            },
          },
          gender: faker.number.int({ min: 0, max: 2 }),
        },
      },
    });
  }

  return influencers;
};
