import Project from 'constants/project';
import { client } from 'api/api-client';
import { AxiosRequestConfig } from 'axios';
import { IDeleteSMLsBody } from './types';

const SMLApi = {
  createSML: async (body: any) => {
    await client.post(`${Project.apis.v1}/sml`, body);
  },

  getSMLs: async (filter: any) => {
    const { data } = await client.get(`${Project.apis.v1}/sml`, {
      params: {
        ...filter,
      },
    });

    return data;
  },

  getAllSMLs: async (filter: any) => {
    const { data } = await client.get(`${Project.apis.v1}/sml/exports`, {
      params: {
        ...filter,
      },
    });

    return data;
  },

  getAllSmlGraphData: async (filters?: any, queryParams?: any) => {
    const response = await client.get(
      `${Project.apis.v1}/insight/sml/smlOverTimeData?${new URLSearchParams(
        queryParams
      )}`,
      {
        params: {
          ...filters,
        },
      }
    );

    return response;
  },

  getAllSmlRevenueGraphData: async (filters?: any, queryParams?: any) => {
    const response = await client.get(
      `${
        Project.apis.v1
      }/insight/sml/smlRevenueOverTimeData?${new URLSearchParams(queryParams)}`,
      {
        params: {
          ...filters,
        },
      }
    );

    return response;
  },

  getClientAllSmlGraphData: async (userId?: number, filters?: any) => {
    const response = await client.get(
      `${Project.apis.v1}/insight/clients/clientProductsOverTimeData/${userId}`,
      {
        params: {
          ...filters,
        },
      }
    );

    return response;
  },

  getSML: async (id: number) => {
    const { data } = await client.get(`${Project.apis.v1}/sml/${id}`);

    return data;
  },

  updateSML: async (body: any, id: number) => {
    await client.patch(`${Project.apis.v1}/sml/${id}`, body);
  },

  deleteSML: async (id: number) => {
    await client.delete(`${Project.apis.v1}/sml/${id}`);
  },

  deleteManySMLs: async (body: IDeleteSMLsBody) => {
    const config: AxiosRequestConfig = {
      data: body,
    };
    const smls = await client.delete(
      `${Project.apis.v1}/sml/deleteSelectedSMLs`,
      config
    );

    return smls;
  },

  getTokens: async () => {
    const { data } = await client.get(`${Project.apis.v1}/sml/creditPackages`);

    return data;
  },
};

export default SMLApi;
