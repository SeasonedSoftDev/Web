import Project from 'constants/project';
import {
  IDeleteCampaignReportsBody,
  IDeleteCampaignsBody,
  IPaginatedCampaignReportsResponse,
  TApproveOrDenyInfluencersForCampaign,
  TCampaign,
  TReportId,
  TSingleCampaign,
  TSubmissionLinkForCampaign,
  TUpdateCampaign,
} from 'api/campaign/types';
import { client } from 'api/api-client';
import { AxiosRequestConfig, AxiosError } from 'axios';

const CampaignAPI = {
  getCampaignsReportTypes: async () => {
    const { data } = await client.get(
      `${Project.apis.v1}/campaign/reportTypes`,
      {
        withCredentials: true,
      }
    );

    return data;
  },

  getCampaigns: async (filters: any) => {
    const { data } = await client.get(`${Project.apis.v1}/campaign`, {
      params: {
        ...filters,
      },
    });
    return data;
  },

  addCampaign: async (body: any) => {
    const { data } = await client.post(`${Project.apis.v1}/campaign`, body);

    return data;
  },

  getSingleCampaign: async (id: number): Promise<TCampaign> => {
    const { data } = await client.get(`${Project.apis.v1}/campaign/${id}`);

    return data;
  },

  updateCampaign: async (id: TSingleCampaign, body: TUpdateCampaign) => {
    await client.patch(`${Project.apis.v1}/campaign/${id}`, body);
  },

  deleteCampaign: async (id: TSingleCampaign) => {
    await client.delete(`${Project.apis.v1}/campaign/${id}`);
  },

  deleteManyCampaigns: async (body: IDeleteCampaignsBody) => {
    const config: AxiosRequestConfig = {
      data: body,
    };
    const campaigns = await client.delete(
      `${Project.apis.v1}/campaign/deleteSelectedCampaigns`,
      config
    );

    return campaigns;
  },
  deleteManyCampaignReports: async (body: IDeleteCampaignReportsBody) => {
    const config: AxiosRequestConfig = {
      data: body,
    };
    const campaigns = await client.delete(
      `${Project.apis.v1}/campaign/reports/deleteSelectedReports`,
      config
    );

    return campaigns;
  },
  addInfluencerToCampaign: async (id: number, influencerIds: number[]) => {
    const response = await client.post(
      `${Project.apis.v1}/campaign/${id}/addInfluencers`,
      influencerIds
    );

    return response;
  },

  inviteInfluencersToCampaign: async (id: number, influencerIds: number[]) => {
    await client.put(`${Project.apis.v1}/campaign/${id}/inviteInfluencers`, {
      influencerIds,
    });
  },

  acceptInvitationToCampaign: async (id: number) => {
    await client.put(`${Project.apis.v1}/campaign/${id}/acceptInvitation`);
  },

  declineInvitationToCampaign: async (id: number) => {
    await client.put(`${Project.apis.v1}/campaign/${id}/declineInvitation`);
  },

  removeInfluencerFromCampaign: async (
    id: number,
    influencerIds?: number[]
  ) => {
    const config: AxiosRequestConfig = {
      data: influencerIds,
    };
    await client.delete(
      `${Project.apis.v1}/campaign/${id}/removeInfluencers`,
      config
    );
  },

  submitInfluencerDataToCampaign: async (
    id: number,
    body: TSubmissionLinkForCampaign
  ) => {
    await client.post(
      `${Project.apis.v1}/campaign/${id}/submitInfluencerData`,
      body
    );
  },
  confirmMatchingInfluencer: async (
    id: number,
    platformInfluencerIds: number[]
  ) => {
    await client.put(`${Project.apis.v1}/campaign/${id}/confirmMatch`, {
      platformInfluencerIds,
    });
  },
  approveSubmissionForCampaign: async (
    id: number,
    body: TApproveOrDenyInfluencersForCampaign
  ) => {
    await client.put(
      `${Project.apis.v1}/campaign/${id}/approveSubmission`,
      body
    );
  },

  disapproveSubmissionForCampaign: async (
    id: number,
    body: TApproveOrDenyInfluencersForCampaign
  ) => {
    await client.put(
      `${Project.apis.v1}/campaign/${id}/disapproveSubmission`,
      body
    );
  },

  startCampaign: async (id: TSingleCampaign) => {
    await client.put(`${Project.apis.v1}/campaign/${id}/startCampaign`);
  },

  finishCampaign: async (id: TSingleCampaign) => {
    await client.put(`${Project.apis.v1}/campaign/${id}/finishCampaign`);
  },

  archiveCampaign: async (id: TSingleCampaign) => {
    await client.put(`${Project.apis.v1}/campaign/${id}/archiveCampaign`);
  },

  createReportForCampaign: async (id: any, body: any) => {
    await client.post(`${Project.apis.v1}/campaign/${id}/reports`, body);
  },

  getReportForCampaign: async (id: any) => {
    await client.get(`${Project.apis.v1}/campaign/${id}/reports`);
  },

  updateReportForCampaign: async (id: TSingleCampaign, reportId: TReportId) => {
    await client.put(`${Project.apis.v1}/campaign/${id}/reports/${reportId}`);
  },

  getPerformancesForCampaign: async (id: TSingleCampaign) => {
    await client.get(`${Project.apis.v1}/campaign/${id}/performances`);
  },

  getCampaignsOverTimeData: async (filters?: any, queryParams?: any) => {
    const { data } = await client.get(
      `${
        Project.apis.v1
      }/insight/campaigns/campaignsOverTimeData?${new URLSearchParams(
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

  getReportsOverTimeData: async (filters?: any, queryParams?: any) => {
    const { data } = await client.get(
      `${
        Project.apis.v1
      }/insight/reports/reportsOverTimeData?${new URLSearchParams(
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

  getReportsRevenueOverTimeData: async (filters?: any, queryParams?: any) => {
    const { data } = await client.get(
      `${
        Project.apis.v1
      }/insight/reports/reportsRevenueOverTimeData?${new URLSearchParams(
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

  getCampaignsRevenueOverTimeData: async (filters?: any, queryParams?: any) => {
    const { data } = await client.get(
      `${
        Project.apis.v1
      }/insight/campaigns/campaignsRevenueOverTimedata?${new URLSearchParams(
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

  createReport: async (body: any) => {
    await client.post(`${Project.apis.v1}/campaign/reports`, body);
  },

  getReports: async (
    filter: any
  ): Promise<IPaginatedCampaignReportsResponse> => {
    const { data } = await client.get(`${Project.apis.v1}/campaign/reports`, {
      params: {
        ...filter,
      },
    });

    return data;
  },

  updateReport: async (id: number, body: any) => {
    await client.patch(`${Project.apis.v1}/campaign/reports/${id}`, body);
  },

  deleteReport: async (id: number) => {
    await client.delete(`${Project.apis.v1}/campaign/reports/${id}`);
  },

  getAllCampaigns: async (queryParams: any) => {
    const response = await client.get(`${Project.apis.v1}/campaign/exports`, {
      params: { ...queryParams },
    });

    return response.data;
  },

  getAllReports: async (queryParams: any) => {
    const response = await client.get(
      `${Project.apis.v1}/campaign/exportReports`,
      {
        params: { ...queryParams },
      }
    );

    return response.data;
  },

  getAllCampaignsAndSurveysDates: async () => {
    const response = await client.get(
      `${Project.apis.v1}/campaign/campaignsAndSurveysDates`
    );

    return response.data;
  },
};

export default CampaignAPI;
