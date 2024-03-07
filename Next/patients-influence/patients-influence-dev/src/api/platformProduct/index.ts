import Project from 'constants/project';
import { client } from 'api/api-client';
import {
  IPlatformCampaignInfluencerPaginationResponse,
  IPlatformSurveyInfluencerPaginationResponse,
  ISingleProductOrderCampaign,
  ISingleProductOrderSurvey,
} from './types';

const PlatformProductAPI = {
  getPlatformProductOrderCampaignInfluencers: async (
    id: number,
    filters: any
  ): Promise<IPlatformCampaignInfluencerPaginationResponse> => {
    const { data } = await client.get(
      `${Project.apis.v1}/platformProduct/${id}/campaign/influencers`,
      {
        params: {
          ...filters,
        },
      }
    );

    return data;
  },
  getPlatformProductOrderSurveyInfluencers: async (
    id: number,
    filters: any
  ): Promise<IPlatformSurveyInfluencerPaginationResponse> => {
    const { data } = await client.get(
      `${Project.apis.v1}/platformProduct/${id}/survey/influencers`,
      {
        params: {
          ...filters,
        },
      }
    );

    return data;
  },
  getPlatformsCampaign: async (
    id: number
  ): Promise<ISingleProductOrderCampaign> => {
    const { data } = await client.get(
      `${Project.apis.v1}/platformProduct/${id}/campaign`
    );

    return data;
  },
  getPlatformsSurvey: async (
    id: number
  ): Promise<ISingleProductOrderSurvey> => {
    const { data } = await client.get(
      `${Project.apis.v1}/platformProduct/${id}/survey`
    );

    return data;
  },

  getUsersProducts: async (
    userId: number,
    search?: string | undefined
  ): Promise<any> => {
    const { data } = await client.get(
      `${Project.apis.v1}/platformProduct/productsByUser`,
      {
        params: {
          userId,
          search,
        },
      }
    );

    return data;
  },
};

export default PlatformProductAPI;
