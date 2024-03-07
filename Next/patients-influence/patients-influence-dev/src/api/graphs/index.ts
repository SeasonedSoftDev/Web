import Project from 'constants/project';
import { client } from 'api/api-client';

const GraphsAPI = {
  getGraphs: async (id: any, filters: any) => {
    const { data } = await client.get(
      `${Project.apis.v1}/insight/clients/clientProductsOverTimedata/${id}`,
      {
        params: { ...filters },
      }
    );

    return data;
  },

  getClientProductsInfluencersOverTimeData: async (id: any, filters: any) => {
    const { data } = await client.get(
      `${Project.apis.v1}/insight/clients/clientProductInfluencersOverTimeData/${id}`,
      {
        params: { ...filters },
      }
    );

    return data;
  },

  getClientRecommendedOverTimeData: async (id: any, filters: any) => {
    const { data } = await client.get(
      `${Project.apis.v1}/insight/clients/clientRecommendedOverTimeData/${id}`,
      {
        params: { ...filters },
      }
    );

    return data;
  },
};

export default GraphsAPI;
