import Project from 'constants/project';
import { client } from 'api/api-client';

const EnumsApi = {
  getUserStatuses: async () => {
    const { data } = await client.get(`${Project.apis.v1}/users/userStatus`);

    return data;
  },
  getReportTypes: async () => {
    const { data } = await client.get(
      `${Project.apis.v1}/campaign/reportTypes`
    );

    return data;
  },

  getGenders: async () => {
    const { data } = await client.get(`${Project.apis.v1}/users/genders`);

    return data;
  },

  getStakeholderTypes: async (influencerType: boolean = false) => {
    const { data } = await client.get(
      `${Project.apis.v1}/stakeholders/stakeholderTypes`,
      {
        params: {
          influencerType,
        },
      }
    );

    return data;
  },

  getEthnicities: async () => {
    const { data } = await client.get(`${Project.apis.v1}/ethnicities`);

    return data;
  },

  getStruggles: async () => {
    const { data } = await client.get(`${Project.apis.v1}/struggles`);

    return data;
  },

  getInterests: async () => {
    const { data } = await client.get(`${Project.apis.v1}/interests`, {
      params: {
        limit: 15,
      },
    });

    return data;
  },

  getInfluencerSize: async () => {
    const { data } = await client.get(`${Project.apis.v1}/influencerSizes`);

    return data;
  },

  getSurveyTypes: async () => {
    const { data } = await client.get(`${Project.apis.v1}/surveys/surveyTypes`);

    return data;
  },

  getPostTypes: async (userId: number) => {
    const { data } = await client.get(
      `${Project.apis.v1}/influencer/${userId}/desiredIncome/campaign/postTypes`
    );

    return data;
  },

  getLanguages: async () => {
    const { data } = await client.get(
      `${Project.apis.v1}/platformProduct/languages`
    );

    return data;
  },

  getSymptoms: async () => {
    const { data } = await client.get(`${Project.apis.v1}/symptoms`, {
      params: {
        limit: 16,
      },
    });

    return data;
  },
};

export default EnumsApi;
