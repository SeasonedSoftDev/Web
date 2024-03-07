import Project from 'constants/project';
import { client } from 'api/api-client';
import { CreateTransactionFlow, CreateWithdrawRequest } from './types';

const FinanceAPI = {
  getBalance: async () => {
    const response = await client.get(`${Project.apis.v1}/finance/balance`);

    return response.data;
  },

  approveWithdrawRequest: async (id: number) => {
    const response = await client.post(
      `${Project.apis.v1}/finance/withdrawFlows/${id}/approve`
    );

    return response.data;
  },

  bulkApproveWithdrawRequest: async (ids: number[]) => {
    const response = await client.post(
      `${Project.apis.v1}/finance/withdrawFlows/bulkApprove`,
      { ids }
    );

    return response.data;
  },

  bulkDeclineWithdrawRequest: async (ids: number[]) => {
    const response = await client.post(
      `${Project.apis.v1}/finance/withdrawFlows/bulkDecline`,
      { ids }
    );

    return response.data;
  },

  declineWithdrawRequest: async (id: number) => {
    const response = await client.post(
      `${Project.apis.v1}/finance/withdrawFlows/${id}/decline`
    );

    return response.data;
  },

  getAllWithdrawRequests: async (filters: any) => {
    const response = await client.get(`${Project.apis.v1}/finance/withdraws`, {
      params: { ...filters },
    });

    return response.data;
  },

  getAllCustomFinanceStatements: async (filters: any) => {
    const response = await client.get(
      `${Project.apis.v1}/finance/customFinanceStatements`,
      {
        params: { ...filters },
      }
    );

    return response.data;
  },

  createWithdrawRequest: async (data: CreateWithdrawRequest) => {
    const response = await client.post(
      `${Project.apis.v1}/finance/withdrawFlows`,
      data
    );

    return response.data;
  },

  createBulkTransactionFlows: async (data: CreateTransactionFlow[]) => {
    const response = await client.post(
      `${Project.apis.v1}/finance/bulkTransactionFlows`,
      data
    );

    return response.data;
  },

  getAllCosts: async (filters: any) => {
    const response = await client.get(`${Project.apis.v1}/finance/costs`, {
      params: { ...filters },
    });

    return response.data;
  },

  approveTransactionFlow: async (id: number) => {
    const response = await client.post(
      `${Project.apis.v1}/finance/transactionFlows/${id}/approve`
    );

    return response;
  },

  declineTransactionFlow: async (id: number) => {
    const response = await client.post(
      `${Project.apis.v1}/finance/transactionFlows/${id}/decline`
    );

    return response;
  },

  approveBulkTransactionFlows: async (ids: number[]) => {
    const response = await client.post(
      `${Project.apis.v1}/finance/bulkTransactionFlows/approve`,
      { ids }
    );

    return response;
  },

  declineBulkTransactionFlows: async (ids: number[]) => {
    const response = await client.post(
      `${Project.apis.v1}/finance/bulkTransactionFlows/decline`,
      { ids }
    );

    return response;
  },

  getAllPayments: async (queryParams: any) => {
    const response = await client.get(`${Project.apis.v1}/finance/payments`, {
      params: { ...queryParams },
    });

    return response.data;
  },

  getAllWithdrawals: async (queryParams: any) => {
    const response = await client.get(
      `${Project.apis.v1}/finance/withdrawals`,
      {
        params: { ...queryParams },
      }
    );

    return response.data;
  },

  getFinanceRevenueOverTimeData: async (filters?: any, queryParams?: any) => {
    const response = await client.get(
      `${
        Project.apis.v1
      }/insight/finance/financeRevenueOverTimeData${new URLSearchParams(
        queryParams
      )}`,
      {
        params: { ...filters },
      }
    );

    return response;
  },

  getFinanceCostOverTimeData: async (filters?: any, queryParams?: any) => {
    const response = await client.get(
      `${
        Project.apis.v1
      }/insight/finance/financeCostOverTimeData${new URLSearchParams(
        queryParams
      )}`,
      {
        params: { ...filters },
      }
    );

    return response;
  },

  getFinanceProfitOverTimeData: async (filters?: any, queryParams?: any) => {
    const response = await client.get(
      `${
        Project.apis.v1
      }/insight/finance/financeProfitOverTimeData${new URLSearchParams(
        queryParams
      )}`,
      {
        params: { ...filters },
      }
    );

    return response;
  },

  getFinanceMarginOverTimeData: async (filters?: any, queryParams?: any) => {
    const response = await client.get(
      `${
        Project.apis.v1
      }/insight/finance/financeMarginOverTimeData${new URLSearchParams(
        queryParams
      )}`,
      {
        params: { ...filters },
      }
    );

    return response;
  },

  createCustomCostFinanceStatement: async (data: any) => {
    const response = await client.post(
      `${Project.apis.v1}/finance/customCostFinanceStatement`,
      data
    );

    return response;
  },

  createCustomRevenueFinanceStatement: async (data: any) => {
    const response = await client.post(
      `${Project.apis.v1}/finance/customRevenueFinanceStatement`,
      data
    );

    return response;
  },
};

export default FinanceAPI;
