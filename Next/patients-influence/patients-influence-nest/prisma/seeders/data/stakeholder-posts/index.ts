import { faker } from '@faker-js/faker';
import { TCreateSeedStateOption } from '../../../../src/utils';

type TCreateStakeholders = {
  count: number;
  stakeholders: TCreateSeedStateOption;
  diseaseAreas: TCreateSeedStateOption;
  themes: TCreateSeedStateOption;
  struggles: TCreateSeedStateOption;
  interests: TCreateSeedStateOption;
  symptoms: TCreateSeedStateOption;
};

export const createStakeholderPosts = ({
  count,
  stakeholders,
  diseaseAreas,
  themes,
  struggles,
  interests,
  symptoms,
}: TCreateStakeholders) => {
  const stakeholderPosts = [];

  for (let i = 0; i < count; i++) {
    stakeholderPosts.push({
      stakeholderId: stakeholders.getRandom().id,
      postTimestamp: faker.date.past({ years: 3 }),
      content: faker.lorem.paragraph(),
      language: faker.helpers.arrayElement(['en', 'de', 'ge', 'sp']),
      overallSentiment: faker.number.int({ min: 0, max: 6 }),
      comments: faker.number.int({ min: 5, max: 1000 }),
      likes: faker.number.int({ min: 5, max: 100000 }),
      isReported: faker.datatype.boolean(),
      reportComment: undefined,
      isDeleted: faker.datatype.boolean(),
      postDiseaseAreas: {
        create: {
          diseaseAreaId: diseaseAreas.getRandom().id,
        },
      },
      postThemes: {
        create: {
          themeId: themes.getRandom().id,
        },
      },
      postBrands: undefined,
      postProducts: undefined,
      postStruggles: {
        create: {
          struggleId: struggles.getRandom().id,
          struggleSentiment: faker.number.int({ min: 0, max: 6 }),
        },
      },
      postInterests: {
        create: { interestId: interests.getRandom().id },
      },
      postSymptom: {
        create: {
          symptomId: symptoms.getRandom().id,
          symptomSentiment: faker.number.int({ min: 0, max: 6 }),
        },
      },
    });
  }

  return stakeholderPosts;
};
