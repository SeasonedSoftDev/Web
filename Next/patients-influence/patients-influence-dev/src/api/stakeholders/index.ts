import Project from 'constants/project';
import { client } from 'api/api-client';
import { TCreateStakeholderParams } from './types';

const StakeholderApi = {
  getReportTypes: async () => {
    const { data } = await client.get(
      `${Project.apis.v1}/campaign/reportTypes`
    );

    return data;
  },
  createStakeholder: async (body: TCreateStakeholderParams) => {
    const { username } = body;

    const response = await client.post(`${Project.apis.v1}/stakeholders`, {
      username,
    });

    return response;
  },

  learnInfluencers: async (
    ids: number[],
    followerCount: number,
    postCount: number,
    bio: number
  ) => {
    const response = await client.post(
      `${Project.apis.v1}/stakeholders/learnInfluencers`,
      {
        ids,
        followerCount,
        postCount,
        bio,
      }
    );

    return response;
  },

  learnFollowers: async (
    ids: number[],
    followerCount: number,
    postCount: number,
    bio: number
  ) => {
    const response = await client.post(
      `${Project.apis.v1}/stakeholders/learnFollowers`,
      {
        ids,
        followerCount,
        postCount,
        bio,
      }
    );

    return response;
  },
};

export default StakeholderApi;
