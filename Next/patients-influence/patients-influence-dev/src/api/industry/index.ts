import Project from 'constants/project';
import { client } from 'api/api-client';

const IndustryApi = {
  getIndustries: async (search: string) => {
    const { data } = await client.get(`${Project.apis.v1}/industries`, {
      params: {
        search,
      },
    });

    return data;
  },

  getOne: async (id: any) => {
    const { data } = await client.get(`${Project.apis.v1}/industries/${id}`);

    return data;
  },
};

export default IndustryApi;
