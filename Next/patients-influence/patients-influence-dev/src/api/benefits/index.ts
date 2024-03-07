import Project from 'constants/project';
import {
  TAddBenefit,
  TSingleBenefit,
  TAddSuggestion,
  IGetBenefitSuggestions,
  IGetAllBenefits,
  IEditBenefitSuggestion,
  IBulkSuggestionBody,
  IBulkBenefitBody,
} from 'api/benefits/types';
import { client } from 'api/api-client';
import { AxiosRequestConfig } from 'axios';

const BenefitsAPI = {
  getBenefits: async (filter: any = {}): Promise<IGetAllBenefits> => {
    const { data }: { data: IGetAllBenefits } = await client.get(
      `${Project.apis.v1}/benefits`,
      {
        params: filter,
      }
    );
    return data;
  },

  getBenefitsGraphData: async (filters: any) => {
    const response = await client.get(
      `${Project.apis.v1}/benefits/benefits/graph/data`,
      {
        params: {
          ...filters,
        },
      }
    );

    return response;
  },

  getBenefitsCategories: async () => {
    const { data } = await client.get(`${Project.apis.v1}/benefits/categories`);

    return data;
  },

  getBenefitsPartnerships: async () => {
    const { data } = await client.get(
      `${Project.apis.v1}/benefits/partnerships`
    );

    return data;
  },

  addBenefit: async (body: TAddBenefit) => {
    await client.post(`${Project.apis.v1}/benefits`, body);
  },

  getSingleBenefit: async (id: TSingleBenefit) => {
    const { data } = await client.post(`${Project.apis.v1}/benefits/${id}`);

    return data;
  },

  updateBenefit: async (id: number, body: TAddBenefit) => {
    await client.patch(`${Project.apis.v1}/benefits/${id}`, body);
  },

  deleteBenefit: async (id: number) => {
    await client.delete(`${Project.apis.v1}/benefits/${id}`);
  },
  deleteManyBenefits: async (body: IBulkBenefitBody) => {
    const config: AxiosRequestConfig = {
      data: body,
    };
    const response = await client.delete(
      `${Project.apis.v1}/benefits/deleteMany`,
      config
    );

    return response;
  },
  getSuggestions: async (filter: any = {}): Promise<IGetBenefitSuggestions> => {
    const { data }: { data: IGetBenefitSuggestions } = await client.get(
      `${Project.apis.v1}/benefits/suggestions`,
      {
        params: filter,
      }
    );

    return data;
  },

  addSuggestion: async (body: TAddSuggestion) => {
    await client.post(`${Project.apis.v1}/benefits/suggestions`, body);
  },

  getSingleSuggestion: async (id: TSingleBenefit) => {
    const { data } = await client.get(
      `${Project.apis.v1}/benefits/suggestions/${id}`
    );

    return data;
  },

  updateSuggestion: async (id: number, body: IEditBenefitSuggestion) => {
    await client.patch(`${Project.apis.v1}/benefits/suggestions/${id}`, body);
  },
  approveSuggestion: async (id: number) => {
    const { data } = await client.patch(
      `${Project.apis.v1}/benefits/suggestions/${id}/approve`
    );
    return data;
  },
  approveManySuggestions: async (body: IBulkSuggestionBody) => {
    const { data } = await client.patch(
      `${Project.apis.v1}/benefits/suggestions/approveMany`,
      body
    );
    return data;
  },
  deleteSuggestion: async (id: number) => {
    await client.delete(`${Project.apis.v1}/benefits/suggestions/${id}`);
  },
  deleteManySuggestions: async (body: IBulkSuggestionBody) => {
    const config: AxiosRequestConfig = {
      data: body,
    };
    const response = await client.delete(
      `${Project.apis.v1}/benefits/suggestions/deleteMany`,
      config
    );

    return response;
  },
  upvoteSuggestion: async (id: number) => {
    await client.post(`${Project.apis.v1}/benefits/suggestions/${id}/upvote`);
  },

  downvoteSuggestion: async (id: number) => {
    await client.post(`${Project.apis.v1}/benefits/suggestions/${id}/downvote`);
  },

  getBenefitsOverTimeData: async (filters?: any, queryParams?: any) => {
    const response = await client.get(
      `${
        Project.apis.v1
      }/insight/benefits/benefitsOverTimeData${new URLSearchParams(
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

  getAllBenefits: async (filters: any) => {
    const { data } = await client.get(`${Project.apis.v1}/benefits/exports`, {
      params: {
        ...filters,
      },
    });

    return data;
  },
};

export default BenefitsAPI;
