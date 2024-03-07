import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker';
import { StakeholderType } from '../../../../src/utils/enums';
import { TCreateSeedStateOption, UserRole } from '../../../../src/utils';

type TCreateStakeholders = {
  count: number;
  users: TCreateSeedStateOption;
  diseaseAreas: TCreateSeedStateOption;
  locations: TCreateSeedStateOption;
  ethnicities: TCreateSeedStateOption;
  socialPlatforms: TCreateSeedStateOption;
};

export const createStakeholders = ({
  count,
  users,
  diseaseAreas,
  locations,
  ethnicities,
  socialPlatforms,
}: TCreateStakeholders) => {
  const stakeholders = [];

  const usedInfluencers = [];

  for (let i = 0; i < count; i++) {
    let newInfluencer: any = null;

    if (i < count / 2) {
      while (
        newInfluencer === null ||
        usedInfluencers.includes(newInfluencer)
      ) {
        newInfluencer = users.getRandom((x) => x.role === UserRole.Influencer);
      }
      usedInfluencers.push(newInfluencer);
    }

    const newInfluencerId = newInfluencer
      ? newInfluencer.influencer.id
      : undefined;

    const type =
      StakeholderType[StakeholderType[faker.number.int({ min: 1, max: 5 })]];
    const patientCaregiverDiseaseAreas = [
      StakeholderType.Caregiver,
      StakeholderType.Patient,
    ].includes(type)
      ? { create: { diseaseAreaId: diseaseAreas.getRandom().id } }
      : undefined;

    stakeholders.push({
      socialPlatformId: socialPlatforms.getRandom().id,
      socialPlatformUserId: randomUUID(),
      socialPlatformUsername: faker.internet.userName(),
      bio: faker.person.bio(),
      type,
      isRegistered: faker.datatype.boolean(),
      isSML: true,
      isQA: true,
      isPrivate: faker.datatype.boolean(),
      followersCount: faker.number.int({ min: 100, max: 10000000 }),
      influencerId: newInfluencerId,
      locationId: locations.getRandom().id,
      ethnicityId: ethnicities.getRandom().id,
      gender: faker.number.int({ min: 0, max: 2 }),
      dateOfBirth: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
      patientCaregiverDiseaseAreas,
    });
  }

  return stakeholders;
};
