import Project from 'constants/project';
// import { TCreateSurveyParams } from 'api/survey/types';
import { client } from 'api/api-client';
import { AxiosRequestConfig } from 'axios';
import { IQuestionAnswersBody } from 'features/survey-questionnaire/role/influencer';
import {
  IApproveDisaproveInfluencersBody,
  ICreateQuestionBody,
  ICreateQuestionResponse,
  IDeleteManySurveyBody,
  ISingleSurveyResponse,
  ISurveyDemographicsData,
  ISurveyQuestionChartResponse,
  IUpdateQuestionBody,
} from './types';

const SurveyAPI = {
  createSurvey: async (body: any) => {
    const { data } = await client.post(`${Project.apis.v1}/surveys`, body);

    return data;
  },

  getSurveys: async (filters: any) => {
    const { data } = await client.get(`${Project.apis.v1}/surveys`, {
      params: {
        ...filters,
      },
    });

    return data;
  },

  getSurvey: async (id: any): Promise<ISingleSurveyResponse> => {
    const { data } = await client.get(`${Project.apis.v1}/surveys/${id}`);

    return data;
  },
  getSurveyAsInfluencer: async (
    id: number,
    influencerId?: number
  ): Promise<any> => {
    const { data } = await client.get(
      `${Project.apis.v1}/surveys/${id}/influencerSurvey`,
      {
        params: {
          influencerId,
        },
      }
    );

    return data;
  },

  getTokens: async () => {
    const { data } = await client.get(
      `${Project.apis.v1}/surveys/creditPackages`
    );

    return data;
  },

  getSurveyOvertimeData: async (filters?: any, queryParams?: any) => {
    const response = await client.get(
      `${
        Project.apis.v1
      }/insight/surveys/surveysOverTimeData${new URLSearchParams(queryParams)}`,
      {
        params: {
          ...filters,
        },
      }
    );

    return response;
  },

  getSurveyRevenueOvertimeData: async (filters?: any, queryParams?: any) => {
    const response = await client.get(
      `${
        Project.apis.v1
      }/insight/surveys/surveysRevenueOverTimeData${new URLSearchParams(
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

  addInfluencersToSurvey: async (id: number, influencerIds: number[]) => {
    const response = await client.post(
      `${Project.apis.v1}/surveys/${id}/addInfluencers`,
      influencerIds
    );

    return response;
  },
  startSurvey: async (id: number) => {
    const response = await client.put(
      `${Project.apis.v1}/surveys/${id}/startSurvey`
    );

    return response;
  },
  finishSurvey: async (id: number) => {
    const response = await client.put(
      `${Project.apis.v1}/surveys/${id}/finishSurvey`
    );

    return response;
  },
  updateSurvey: async (id: any, body: any) => {
    await client.patch(`${Project.apis.v1}/surveys/${id}`, body);
  },
  deleteSurvey: async (id: number) => {
    await client.delete(`${Project.apis.v1}/surveys/${id}`);
  },
  inviteInfluencersToSurvey: async (id: number, influencerIds: number[]) => {
    await client.put(`${Project.apis.v1}/surveys/${id}/inviteInfluencers`, {
      influencerIds,
    });
  },
  removeInfluencersFromSurvey: async (id: number, influencerIds?: number[]) => {
    const config: AxiosRequestConfig = {
      data: influencerIds,
    };
    await client.delete(
      `${Project.apis.v1}/surveys/${id}/removeInfluencers`,
      config
    );
  },
  acceptInvitationToSurvey: async (id: number) => {
    await client.put(`${Project.apis.v1}/surveys/${id}/acceptInvitation`);
  },
  declineInvitationToSurvey: async (id: number) => {
    await client.put(`${Project.apis.v1}/surveys/${id}/declineInvitation`);
  },

  deleteManySurveys: async (body: IDeleteManySurveyBody) => {
    const config: AxiosRequestConfig = {
      data: body,
    };
    const surveys = await client.delete(
      `${Project.apis.v1}/surveys/deleteSelectedSurveys`,
      config
    );

    return surveys;
  },
  createSurveyQuestion: async (id: number, body: ICreateQuestionBody) => {
    const { data }: { data: ICreateQuestionResponse } = await client.post(
      `${Project.apis.v1}/surveys/${id}/questions`,
      body
    );
    return data;
  },
  deleteSurveyQuestion: async (id: number, questionId: number) => {
    const { data }: { data: ICreateQuestionResponse } = await client.delete(
      `${Project.apis.v1}/surveys/${id}/questions/${questionId}`
    );
    return data;
  },
  updateSurveyQuestion: async (
    id: number,
    questionId: number,
    body: IUpdateQuestionBody
  ) => {
    const { data } = await client.patch(
      `${Project.apis.v1}/surveys/${id}/questions/${questionId}`,
      body
    );

    return data;
  },
  createSurveyQuestionOption: async (
    id: number,
    surveyQuestionId: number,
    body: { answer: string; isOther?: boolean }
  ) => {
    const { data } = await client.post(
      `${Project.apis.v1}/surveys/${id}/questions/${surveyQuestionId}/answerChoices`,
      body
    );

    return data;
  },
  updateSurveyQuestionOption: async (
    id: number,
    surveyQuestionId: number,
    choiceId: number,
    body: { answer: string }
  ) => {
    const { data } = await client.patch(
      `${Project.apis.v1}/surveys/${id}/questions/${surveyQuestionId}/answerChoices/${choiceId}`,
      body
    );

    return data;
  },
  deleteSurveyQuestionType: async (
    id: number,
    surveyQuestionId: number,
    choiceId: number
  ) => {
    const { data } = await client.delete(
      `${Project.apis.v1}/surveys/${id}/questions/${surveyQuestionId}/answerChoices/${choiceId}`
    );

    return data;
  },
  getSurveyQuestions: async (id: number) => {
    const { data } = await client.get(
      `${Project.apis.v1}/surveys/${id}/questions`
    );

    return data;
  },
  getDemographicGraphData: async (
    id: number
  ): Promise<ISurveyDemographicsData> => {
    const { data }: { data: ISurveyDemographicsData } = await client.get(
      `${Project.apis.v1}/surveys/${id}/demographics`
    );

    return data;
  },
  getSurveyQuestionResponse: async (
    id: number,
    questionId: number,
    influencerId?: number
  ): Promise<ISurveyQuestionChartResponse> => {
    const { data }: { data: ISurveyQuestionChartResponse } = await client.get(
      `${Project.apis.v1}/surveys/${id}/questions/responses/${questionId}`,
      {
        params: {
          influencerId,
        },
      }
    );
    return data;
  },
  submitSurveyResults: async (id: number, body: IQuestionAnswersBody[]) => {
    const response = await client.post(
      `${Project.apis.v1}/surveys/${id}/submitSurveyResults`,
      body
    );

    return response;
  },
  approveInfluencerSuveySubmission: async (
    id: number,
    body: IApproveDisaproveInfluencersBody
  ) => {
    const response = await client.put(
      `${Project.apis.v1}/surveys/${id}/approveSubmission`,
      body
    );

    return response;
  },
  disaproveInfluencerSuveySubmission: async (
    id: number,
    body: IApproveDisaproveInfluencersBody
  ) => {
    const response = await client.put(
      `${Project.apis.v1}/surveys/${id}/disapproveSubmission`,
      body
    );

    return response;
  },
  getAllSurveys: async (queryParams: any) => {
    const response = await client.get(`${Project.apis.v1}/surveys/exports`, {
      params: { ...queryParams },
    });

    return response.data;
  },
};

export default SurveyAPI;
