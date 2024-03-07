import Project from 'constants/project';
import {
  IPaginatedClientsResponse,
  IPaginatedDiscoverClientsResults,
  ISingleClientResponse,
  TSingleClient,
} from 'api/client/types';
import { client } from 'api/api-client';

const ClientAPI = {
  registration: async (body: any, locale: string) => {
    const { data } = await client.post(
      `${Project.apis.v1}/client/registration`,
      body,
      {
        params: {
          lang: locale,
        },
      }
    );
    return data;
  },

  registrationViaInvitation: async (body: any) => {
    const { data } = await client.post(
      `${Project.apis.v1}/client/registrationViaInvitation`,
      body
    );
    return data;
  },

  getGraphs: async (id: number) => {
    const { data } = await client.get(
      `${Project.apis.v1}/insight/clients/clientProductsOverTimedata/${id}`,
      {
        params: {
          product: 0,
          startFromUserRegistration: true,
          status: 0,
          statusAtPointOfTime: true,
          useStrictPeriod: false,
          numberOfPoints: 30,
          graphType: 'cumulative',
        },
      }
    );

    return data;
  },

  getGraphsReport: async (id: number, filters: any) => {
    const { data } = await client.get(
      `${Project.apis.v1}/insight/clients/clientProductsOverTimedata/${id}`,
      {
        params: {
          ...filters,
        },
      }
    );

    return data;
  },

  getClientCampaignsPerformanceOverTimeData: async (
    id: number,
    filters: any
  ) => {
    const { data } = await client.get(
      `${Project.apis.v1}/insight/clients/clientCampaignsPerformanceOverTimeData/${id}`,
      {
        params: {
          ...filters,
        },
      }
    );

    return data;
  },

  getClientsTable: async (
    filters?: any
  ): Promise<IPaginatedClientsResponse> => {
    const { data } = await client.get(`${Project.apis.v1}/client/table`, {
      params: {
        ...filters,
      },
    });

    return data;
  },

  getClients: async (search?: string) => {
    const { data } = await client.get(`${Project.apis.v1}/client`, {
      params: {
        search,
        limit: 10,
      },
    });

    return data;
  },

  getDClientsIdentified: async (filters?: any) => {
    const { data } = await client.get(
      `${Project.apis.v1}/client/discoverClients?stage=identified`,
      {
        params: {
          ...filters,
        },
      }
    );

    return data;
  },

  getDClientsContacted: async (filters?: any) => {
    const { data } = await client.get(
      `${Project.apis.v1}/client/discoverClients?stage=contacted`,
      {
        params: {
          ...filters,
        },
      }
    );

    return data;
  },

  getDregisteredClientsGraphDataDaily: async (filters?: any) => {
    const { data } = await client.get(
      `${Project.apis.v1}/insight/clients/discoverClientsOverTimeData?graphPeriod=daily`,
      {
        params: {
          ...filters,
        },
      }
    );

    return data;
  },

  getClientsOverTimeData: async (filters?: any, queryParams?: any) => {
    const { data } = await client.get(
      `${
        Project.apis.v1
      }/insight/clients/clientsOverTimeData?${new URLSearchParams(
        queryParams
      )}`,
      {
        params: {
          ...filters,
        },
      }
    );

    return data;
  },
  getDregisteredClientsGraphData: async (filters?: any, queryParams?: any) => {
    const { data } = await client.get(
      `${
        Project.apis.v1
      }/insight/clients/discoverClientsOverTimeData?${new URLSearchParams(
        queryParams
      )}`,
      {
        params: {
          ...filters,
        },
      }
    );

    return data;
  },

  getDregisteredClientsGraphDataMonthly: async (filters?: any) => {
    const { data } = await client.get(
      `${Project.apis.v1}/insight/clients/discoverClientsOverTimeData`,
      {
        params: {
          ...filters,
        },
      }
    );

    return data;
  },

  getDregisteredClientsGraphDataYearly: async (filters?: any) => {
    const { data } = await client.get(
      `${Project.apis.v1}/insight/clients/discoverClientsOverTimeData?graphPeriod=yearly`,
      {
        params: {
          ...filters,
        },
      }
    );

    return data;
  },

  getDClientsRegisteredAllRegistered: async (filters?: any) => {
    const response = await client.get(
      `${Project.apis.v1}/client/discoverClientsAllGraphData?stage=registered`,
      {
        params: {
          ...filters,
        },
      }
    );

    return response;
  },

  getDClientsRegisteredAllStaged: async (filters?: any) => {
    const response = await client.get(
      `${Project.apis.v1}/client/discoverClientsAllGraphData?stage=staged`,
      {
        params: {
          ...filters,
        },
      }
    );

    return response;
  },

  getDClientsRegistered: async (
    filters?: any
  ): Promise<IPaginatedDiscoverClientsResults> => {
    const { data } = await client.get(
      `${Project.apis.v1}/client/discoverClients?stage=registered`,
      {
        params: {
          ...filters,
        },
      }
    );

    return data;
  },

  getDClientsScheduled: async (
    filters?: any
  ): Promise<IPaginatedDiscoverClientsResults> => {
    const { data } = await client.get(
      `${Project.apis.v1}/client/discoverClients?stage=scheduled`,
      {
        params: {
          ...filters,
        },
      }
    );

    return data;
  },

  addDClients: async (body: any) => {
    await client.post(`${Project.apis.v1}/client/discoverClients`, body);
  },

  inviteDClients: async (id: any) => {
    await client.put(`${Project.apis.v1}/client/discoverClients/${id}/invite`);
  },

  updateDClients: async (body: any, id: any) => {
    await client.patch(`${Project.apis.v1}/client/discoverClients/${id}`, body);
  },

  updateClient: async (body: any, id: any) => {
    await client.patch(`${Project.apis.v1}/client/${id}`, body);
  },

  getSingleClient: async (id: number): Promise<ISingleClientResponse> => {
    const { data } = await client.get(`${Project.apis.v1}/client/${id}`);

    return data;
  },

  deleteClient: async (id: TSingleClient) => {
    const { data } = await client.delete(`${Project.apis.v1}/client/${id}`);

    return data;
  },

  clientDiseaseAreas: async () => {
    const { data } = await client.get(`${Project.apis.v1}/client/diseaseAreas`);

    return data;
  },

  clientRecommendedDiseaseAreas: async () => {
    const { data } = await client.get(
      `${Project.apis.v1}/client/recommendedDiseaseAreas`
    );

    return data;
  },

  clientProducts: async (search?: string) => {
    const { data } = await client.get(`${Project.apis.v1}/client/products`, {
      params: {
        search,
        limit: 10,
      },
    });

    return data;
  },

  addClientProduct: async (body: any) => {
    await client.post(`${Project.apis.v1}/client/products`, body);
  },

  getAllClients: async (filters?: any) => {
    const { data } = await client.get(`${Project.apis.v1}/client/export`, {
      params: {
        ...filters,
      },
    });

    return data;
  },

  getAllDiscoverClients: async (filters?: any) => {
    const { data } = await client.get(
      `${Project.apis.v1}/client/exportDiscoverClients`,
      {
        params: {
          ...filters,
        },
      }
    );

    return data;
  },
};

export default ClientAPI;
