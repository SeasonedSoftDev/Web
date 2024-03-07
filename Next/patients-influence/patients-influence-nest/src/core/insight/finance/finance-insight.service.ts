import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { getPeriods } from '../utils/period-generator';
import { GraphParamsDto } from '../dto/graph-params.dto';
import { Prisma } from '@prisma/client';
import { IGraphDataPoint } from '../interfaces/graph-data-point.interface';
import { IGraphResult } from '../interfaces/graph-result.interface';
import { graphQueryWhere } from '../utils/query-where';
import { Status } from 'src/core/campaign/enums/status.enum';
import { FinanceStatus } from 'src/core/campaign/enums/finance-status.enum';
import { GraphPeriod } from '../enums/graph-period.enum';
import { GraphIncludeData } from '../enums/graph-include-data.enum';
import { getChange } from '../utils/relative-change';
import { TransactionFlowType, TransactionStatus } from 'src/utils';

@Injectable()
export class FinanceInsightService {
  private readonly logger = new Logger(FinanceInsightService.name);

  constructor(private readonly prismaService: PrismaService) {}

  private async getFinanceRevenueDataDataIncluded(
    {
      useStrictPeriod,
      graphPeriod,
      numberOfPoints,
      graphType,
      maxResults,
      roundDateToDay,
      roundDateToMonth,
      includeOngoingPeriod,
      includePeriodBorders,
      includeData,
    }: GraphParamsDto,
    queryWhere: Prisma.PlatformProductOrderWhereInput,
  ) {
    const dataIncluded: { GraphIncludeData?: number | 'N/A' } = {};

    if (!includeData) return dataIncluded;

    for (const data of includeData) {
      let includeDataGraphPeriod: GraphPeriod;

      switch (data) {
        case GraphIncludeData.changePercentageDay:
          includeDataGraphPeriod = GraphPeriod.Daily;
          break;
        case GraphIncludeData.changePercentageWeek:
          includeDataGraphPeriod = GraphPeriod.Weekly;
          break;
        case GraphIncludeData.changePercentageMonth:
          includeDataGraphPeriod = GraphPeriod.Monthly;
          break;
        default:
          break;
      }

      if (data === GraphIncludeData.total) {
        dataIncluded[data] = (
          await this.prismaService.platformProductOrder.aggregate({
            _sum: { budget: true },
            where: {
              ...graphQueryWhere(graphType, undefined, undefined),
              ...queryWhere,
            },
          })
        )._sum.budget.toNumber();
      } else {
        dataIncluded[data] = await (async () => {
          const periods = getPeriods(
            includeDataGraphPeriod,
            undefined,
            {
              includeOngoingPeriod,
              roundDateToDay,
              roundDateToMonth,
              numOfLastPeriods: 2,
            },
            this.logger,
          );
          const lastDataPeriod = periods.at(-1);
          const preLastDataPeriod = periods.at(-2);

          const lastData =
            await this.prismaService.platformProductOrder.aggregate({
              _sum: { budget: true },
              where: {
                ...graphQueryWhere(
                  graphType,
                  lastDataPeriod.dateFrom,
                  lastDataPeriod.dateTo,
                ),
                ...queryWhere,
              },
            });
          const preLastData =
            await this.prismaService.platformProductOrder.aggregate({
              _sum: { budget: true },
              where: {
                ...graphQueryWhere(
                  graphType,
                  preLastDataPeriod.dateFrom,
                  preLastDataPeriod.dateTo,
                ),
                ...queryWhere,
              },
            });

          // return requested data, eg. percentage change

          if (
            lastData._sum.budget === null ||
            lastData._sum.budget === undefined ||
            preLastData._sum.budget === null ||
            preLastData._sum.budget === undefined
          ) {
            return 0;
          }
          return getChange(
            lastData._sum.budget ? lastData._sum.budget.toNumber() : 0,
            lastData._sum.budget ? preLastData._sum.budget.toNumber() : 0,
          );
        })();
      }
    }

    return dataIncluded;
  }

  async getFinanceRevenueData({
    useStrictPeriod,
    graphPeriod,
    numberOfPoints,
    graphType,
    maxResults,
    roundDateToDay,
    roundDateToMonth,
    includeOngoingPeriod,
    includePeriodBorders,
    includeData,
  }: // { financeStatus }:
  GraphParamsDto) {
    const queryWhere: Prisma.PlatformProductOrderWhereInput = {
      financeStatus: FinanceStatus.Received,
      budget: { gt: 0 },
    };
    const periods = getPeriods(
      graphPeriod,
      undefined,
      {
        includeOngoingPeriod, // ? true
        roundDateToDay, // ? true
        roundDateToMonth,
        numOfLastPeriods: maxResults,
      },
      this.logger,
    );

    const dataIncluded = await this.getFinanceRevenueDataDataIncluded(
      {
        useStrictPeriod,
        graphPeriod,
        numberOfPoints,
        graphType,
        maxResults,
        roundDateToDay,
        roundDateToMonth,
        includeOngoingPeriod,
        includePeriodBorders,
        includeData,
      },
      queryWhere,
    );

    const result: IGraphResult = { data: [], ...dataIncluded };

    for (const { dateFrom, dateTo } of periods) {
      const queryResult =
        await this.prismaService.platformProductOrder.aggregate({
          _sum: { budget: true },
          where: {
            ...graphQueryWhere(graphType, dateFrom, dateTo),
            ...queryWhere,
          },
        });
      const dataPoint: IGraphDataPoint = {
        value:
          queryResult._sum.budget !== null
            ? queryResult._sum.budget.toNumber()
            : 0,
        timestamp: dateFrom,
        dateFrom,
        dateTo,
      };

      if (includePeriodBorders) result.data.push(dataPoint);
      else {
        const { value, timestamp, ...periodBorders } = dataPoint;
        result.data.push({ value, timestamp });
      }
    }

    return result;
  }

  private async getFinanceCostDataDataIncluded(
    {
      useStrictPeriod,
      graphPeriod,
      numberOfPoints,
      graphType,
      maxResults,
      roundDateToDay,
      roundDateToMonth,
      includeOngoingPeriod,
      includePeriodBorders,
      includeData,
    }: GraphParamsDto,
    queryWhere: Prisma.TransactionFlowWhereInput,
  ) {
    const dataIncluded: { GraphIncludeData?: number | 'N/A' } = {};

    if (!includeData) return dataIncluded;

    for (const data of includeData) {
      let includeDataGraphPeriod: GraphPeriod;

      switch (data) {
        case GraphIncludeData.changePercentageDay:
          includeDataGraphPeriod = GraphPeriod.Daily;
          break;
        case GraphIncludeData.changePercentageWeek:
          includeDataGraphPeriod = GraphPeriod.Weekly;
          break;
        case GraphIncludeData.changePercentageMonth:
          includeDataGraphPeriod = GraphPeriod.Monthly;
          break;
        default:
          break;
      }

      if (data === GraphIncludeData.total) {
        dataIncluded[data] = (
          await this.prismaService.transactionFlow.aggregate({
            _sum: { amount: true },
            where: {
              ...graphQueryWhere(graphType, undefined, undefined),
              ...queryWhere,
            },
          })
        )._sum.amount.toNumber();
      } else {
        dataIncluded[data] = await (async () => {
          const periods = getPeriods(
            includeDataGraphPeriod,
            undefined,
            {
              includeOngoingPeriod,
              roundDateToDay,
              roundDateToMonth,
              numOfLastPeriods: 2,
            },
            this.logger,
          );
          const lastDataPeriod = periods.at(-1);
          const preLastDataPeriod = periods.at(-2);

          const lastData = await this.prismaService.transactionFlow.aggregate({
            _sum: { amount: true },
            where: {
              ...graphQueryWhere(
                graphType,
                lastDataPeriod.dateFrom,
                lastDataPeriod.dateTo,
              ),
              ...queryWhere,
            },
          });
          const preLastData =
            await this.prismaService.transactionFlow.aggregate({
              _sum: { amount: true },
              where: {
                ...graphQueryWhere(
                  graphType,
                  preLastDataPeriod.dateFrom,
                  preLastDataPeriod.dateTo,
                ),
                ...queryWhere,
              },
            });

          if (
            lastData._sum.amount === null ||
            lastData._sum.amount === undefined ||
            preLastData._sum.amount === null ||
            preLastData._sum.amount === undefined
          ) {
            return 0;
          }

          // return requested data, eg. percentage change
          return getChange(
            lastData._sum.amount.toNumber(),
            preLastData._sum.amount.toNumber(),
          );
        })();
      }
    }

    return dataIncluded;
  }

  async getFinanceCostData({
    useStrictPeriod,
    graphPeriod,
    numberOfPoints,
    graphType,
    maxResults,
    roundDateToDay,
    roundDateToMonth,
    includeOngoingPeriod,
    includePeriodBorders,
    includeData,
  }: GraphParamsDto) {
    const queryWhere: Prisma.TransactionFlowWhereInput = {
      transactions: {
        every: {
          status: {
            in: [TransactionStatus.Approved, TransactionStatus.Pending],
          },
        },
      },
      type: TransactionFlowType.Salary,
      productOrderId: {
        not: null,
      },
    };
    const periods = getPeriods(
      graphPeriod,
      undefined,
      {
        includeOngoingPeriod, // ? true
        roundDateToDay, // ? true
        roundDateToMonth,
        numOfLastPeriods: maxResults,
      },
      this.logger,
    );

    const dataIncluded = await this.getFinanceCostDataDataIncluded(
      {
        useStrictPeriod,
        graphPeriod,
        numberOfPoints,
        graphType,
        maxResults,
        roundDateToDay,
        roundDateToMonth,
        includeOngoingPeriod,
        includePeriodBorders,
        includeData,
      },
      queryWhere,
    );

    const result: IGraphResult = { data: [], ...dataIncluded };

    for (const { dateFrom, dateTo } of periods) {
      const queryResult = await this.prismaService.transactionFlow.aggregate({
        _sum: { amount: true },
        where: {
          ...graphQueryWhere(graphType, dateFrom, dateTo),
          ...queryWhere,
        },
      });
      const dataPoint: IGraphDataPoint = {
        value:
          queryResult._sum.amount !== null
            ? queryResult._sum.amount.toNumber()
            : 0,
        timestamp: dateFrom,
        dateFrom,
        dateTo,
      };

      if (includePeriodBorders) result.data.push(dataPoint);
      else {
        const { value, timestamp, ...periodBorders } = dataPoint;
        result.data.push({ value, timestamp });
      }
    }

    return result;
  }

  async getFinanceProfitData({
    useStrictPeriod,
    graphPeriod,
    numberOfPoints,
    graphType,
    maxResults,
    roundDateToDay,
    roundDateToMonth,
    includeOngoingPeriod,
    includePeriodBorders,
    includeData,
  }: GraphParamsDto) {
    const revenueData = await this.getFinanceRevenueData({
      graphPeriod,
      graphType,
      maxResults,
      roundDateToDay,
      roundDateToMonth,
      includeOngoingPeriod,
      includePeriodBorders,
    });
    const costData = await this.getFinanceCostData({
      graphPeriod,
      graphType,
      maxResults,
      roundDateToDay,
      roundDateToMonth,
      includeOngoingPeriod,
      includePeriodBorders,
    });
    const result: IGraphResult = { data: [] };

    for (let i = 0; i < revenueData.data.length; i++) {
      const dataPoint: IGraphDataPoint = {
        value: revenueData.data[i].value - costData.data[i].value,
        timestamp: revenueData.data[i].timestamp,
      };

      if (includePeriodBorders) {
        dataPoint.dateFrom = revenueData.data[i].dateFrom;
        dataPoint.dateTo = revenueData.data[i].dateTo;
      }

      result.data.push(dataPoint);
    }

    return result;
  }

  async getFinanceMarginData({
    useStrictPeriod,
    graphPeriod,
    numberOfPoints,
    graphType,
    maxResults,
    roundDateToDay,
    roundDateToMonth,
    includeOngoingPeriod,
    includePeriodBorders,
    includeData,
  }: GraphParamsDto) {
    const profitData = await this.getFinanceProfitData({
      graphPeriod,
      graphType,
      maxResults,
      roundDateToDay,
      roundDateToMonth,
      includeOngoingPeriod,
      includePeriodBorders,
    });
    const revenueData = await this.getFinanceRevenueData({
      graphPeriod,
      graphType,
      maxResults,
      roundDateToDay,
      roundDateToMonth,
      includeOngoingPeriod,
      includePeriodBorders,
    });

    const result: IGraphResult = { data: [] };

    for (let i = 0; i < profitData.data.length; i++) {
      const dataPoint: IGraphDataPoint = {
        value:
          revenueData.data[i].value !== 0
            ? profitData.data[i].value / revenueData.data[i].value
            : 0,
        timestamp: profitData.data[i].timestamp,
      };

      if (includePeriodBorders) {
        dataPoint.dateFrom = profitData.data[i].dateFrom;
        dataPoint.dateTo = profitData.data[i].dateTo;
      }

      result.data.push(dataPoint);
    }

    return result;
  }
}
