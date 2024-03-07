import Project from 'constants/project';
import {
  ICompany,
  ICompanyTitle,
  TCreateCompanyTitle,
} from 'api/company/types';

import { client } from 'api/api-client';

const CompanyAPI = {
  create: async (body: any) => {
    const { data } = await client.post(`${Project.apis.v1}/companies`, body);

    return data;
  },

  getAll: async (search: string) => {
    const { data } = await client.get(`${Project.apis.v1}/companies`, {
      params: {
        search,
        limit: 10,
        approvalStatus: 'Approved',
      },
    });

    return data;
  },

  createTitle: async (body: TCreateCompanyTitle) => {
    const { data } = await client.post(
      `${Project.apis.v1}/companies/title`,
      body
    );

    return data;
  },

  getAllTitles: async (search: string) => {
    const { data } = await client.get(`${Project.apis.v1}/companies/title`, {
      params: {
        search,
        limit: 20,
      },
    });

    return data;
  },

  getOneCompany: async (id: any): Promise<ICompany> => {
    const { data } = await client.get(`${Project.apis.v1}/companies/${id}`);

    return data;
  },

  getOneCompanyTitle: async (id: number): Promise<ICompanyTitle> => {
    const { data } = await client.get(
      `${Project.apis.v1}/companies/title/${id}`
    );

    return data;
  },
};

export default CompanyAPI;
