import Project from 'constants/project';
import { TCreateDiseaseArea, TSingleDiseaseArea } from 'api/diseaseArea/types';

import { client } from 'api/api-client';

const DiseaseAreaAPI = {
  create: async (body: TCreateDiseaseArea) => {
    const { data } = await client.post(`${Project.apis.v1}/diseaseAreas`, body);

    return data;
  },

  getAll: async (search?: string) => {
    const { data } = await client.get(`${Project.apis.v1}/diseaseAreas`, {
      params: {
        search,
        limit: 10,
      },
    });

    return data;
  },

  getAllUnlimited: async (search?: string) => {
    const { data } = await client.get(`${Project.apis.v1}/diseaseAreas`, {
      params: {
        search,
      },
    });

    return data;
  },

  getOne: async (id: TSingleDiseaseArea) => {
    const { data } = await client.get(`${Project.apis.v1}/diseaseAreas/${id}`);

    return data;
  },
};

export default DiseaseAreaAPI;
