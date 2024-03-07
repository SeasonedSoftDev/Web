import Project from 'constants/project';
import { TCreateLocation } from 'api/location/types';

import { client } from 'api/api-client';

const LocationAPI = {
  create: async (body: TCreateLocation) => {
    const { data } = await client.post(`${Project.apis.v1}/locations`, body);

    return data;
  },

  getAll: async (search?: string) => {
    const { data } = await client.get(`${Project.apis.v1}/locations`, {
      params: {
        search,
        limit: 10,
      },
    });

    return data;
  },

  getOne: async (id: any) => {
    const { data } = await client.get(`${Project.apis.v1}/locations/${id}`);

    return data;
  },
};

export default LocationAPI;
