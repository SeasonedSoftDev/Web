import { client } from 'api/api-client';
import Project from 'constants/project';

export const PlatformProductOrderAPI = {
  getRevenues: async (filters: any) => {
    const response = await client.get(
      `${Project.apis.v1}/platformProduct/revenues`,
      {
        params: {
          ...filters,
        },
      }
    );

    return response.data;
  },

  allRevenues: async (filters: any) => {
    const response = await client.get(
      `${Project.apis.v1}/platformProduct/allRevenues`,
      {
        params: {
          ...filters,
        },
      }
    );

    return response.data;
  },

  updateById: async (id: number, body: any) => {
    const response = await client.patch(
      `${Project.apis.v1}/platformProduct/${id}`,
      body
    );

    return response;
  },

  updatePlatformProductPayments: async (id: number[], status: number) => {
    const response = await client.patch(
      `${Project.apis.v1}/platformProduct/updatePlatformProductPayments`,
      {
        paymentIds: id,
        status,
      }
    );

    return response;
  },

  receivePendingRevenues: async (body: any) => {
    const response = await client.patch(
      `${Project.apis.v1}/platformProduct/receivePendingRevenues`,
      body
    );

    return response;
  },
};
