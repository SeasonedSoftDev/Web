/* eslint-disable no-shadow */
// This was taken from Swagger DOCS

export enum CampaignAndSurveyStatus {
  InPreparation,
  OnGoing,
  Finished,
  Archived,
}

export enum CampaignAndSurveyPerformance {
  Comments,
  Likes,
  Reach,
  WebsiteClicks,
}

export enum SMLStatus {
  Ordered = 1,
  Ready = 2,
  Delivered = 3,
}

export interface BaseGraphRequest {
  graphPeriod: 'daily' | 'weekly' | 'monthly' | 'yearly';
  graphType?: 'cumulative' | 'periodBased';
  maxResults?: number;
  roundDateToDay?: boolean;
  roundDateToMonth?: boolean;
  includeLastDynamicPeriod?: boolean;
  includePeriodBorders?: boolean;
}

export interface BaseGraphResponse {
  data?: {
    value: number;
    timestamp: string;
    dateFrom?: string;
    dateTo?: string;
  }[];
  changePercentage?: number;
}

export interface GetClientsClientCampaignsPerformanceOvertimeDataRequest
  extends BaseGraphRequest {
  status?: CampaignAndSurveyStatus;
  performanceType: CampaignAndSurveyPerformance;
}

// GetClientsClientSurveysOverTimeData
export interface GetClientsClientSurveysOverTimeDataRequest
  extends BaseGraphRequest {
  status?: CampaignAndSurveyStatus;
}

export interface GetClientsClientSurveysOverTimeDataResponse
  extends BaseGraphResponse {}

// GetClientsClientSMLsOverTimeData
export interface GetClientsClientSMLsOverTimeDataRequest
  extends BaseGraphRequest {
  status?: SMLStatus;
}

export interface GetClientsClientSMLsOverTimeDataResponse
  extends BaseGraphResponse {}

// GetClientsClientCampaignsOverTimeData
export interface GetClientsClientCampaignsOverTimeDataRequest
  extends BaseGraphRequest {
  status?: CampaignAndSurveyStatus;
}

export interface GetClientsClientCampaignsOverTimeDataResponse
  extends BaseGraphResponse {}
