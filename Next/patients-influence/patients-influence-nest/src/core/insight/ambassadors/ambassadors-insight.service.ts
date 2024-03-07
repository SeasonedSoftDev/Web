import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { GraphParamsDto } from '../dto/graph-params.dto';
import { Prisma } from '@prisma/client';
import { IGraphResult } from '../interfaces/graph-result.interface';
import { GraphIncludeData } from '../enums/graph-include-data.enum';
import { GraphPeriod } from '../enums/graph-period.enum';
import { IGraphDataPoint } from '../interfaces/graph-data-point.interface';
import { getPeriods } from '../utils/period-generator';
import { graphQueryWhere } from '../utils/query-where';
import { getChange } from '../utils/relative-change';
import { ClientProductFilterParamsDto } from '../clients/dto/client-product-filter-params.dto';
import { UserGraphParamsDto } from '../dto/user-graph-params.dto';
import { Status } from 'src/core/campaign/enums';
import { TransactionFlowType, TransactionStatus } from 'src/utils';

@Injectable()
export class AmbassadorsInsightService {
  private readonly logger = new Logger(AmbassadorsInsightService.name);

  constructor(private readonly prismaService: PrismaService) {}

  private async getCountDataDataIncluded(
    {
      graphType,
      roundDateToDay,
      roundDateToMonth,
      includeOngoingPeriod,
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
          await this.prismaService.platformProductOrder.count({
            select: { _all: true },
            where: {
              ...graphQueryWhere(graphType, undefined, undefined),
              ...queryWhere,
            },
          })
        )._all;
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

          const lastData = await this.prismaService.platformProductOrder.count({
            select: { _all: true },
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
            await this.prismaService.platformProductOrder.count({
              select: { _all: true },
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
          return getChange(lastData._all, preLastData._all);
        })();
      }
    }

    return dataIncluded;
  }

  async getClientsCountData(
    userId: number,
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
      startFromUserRegistration,
    }: UserGraphParamsDto,
    { product }: ClientProductFilterParamsDto,
  ) {
    const ambassador = await this.prismaService.ambassador.findUniqueOrThrow({
      where: { userId },
    });

    const queryWhere: Prisma.PlatformProductOrderWhereInput = {
      client: {
        ambassadorId: ambassador.id,
      },
      platformProduct: product,
      status: {
        in:
          product === 0 || product === 1
            ? [Status.OnGoing, Status.Finished]
            : [Status.Ordered, Status.Delivered],
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

    const dataIncluded = await this.getCountDataDataIncluded(
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
      const queryResult = await this.prismaService.platformProductOrder.count({
        select: { _all: true },
        where: {
          ...graphQueryWhere(graphType, dateFrom, dateTo),
          ...queryWhere,
        },
      });
      const dataPoint: IGraphDataPoint = {
        value: queryResult._all,
        timestamp: dateFrom,
        dateFrom,
        dateTo,
      };

      if (includePeriodBorders) result.data.push(dataPoint);
      else {
        const { value, timestamp } = dataPoint;
        result.data.push({ value, timestamp });
      }
    }

    return result;
  }

  async getClientsProductsCountData(
    userId: number,
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
    }: UserGraphParamsDto,
    { product, status }: ClientProductFilterParamsDto,
  ) {
    const ambassador = await this.prismaService.ambassador.findUniqueOrThrow({
      where: { userId },
    });

    const queryWhere: Prisma.PlatformProductOrderWhereInput = {
      client: {
        ambassadorId: ambassador.id,
      },
      platformProduct: product,
      OR: [{ statusChangelog: { some: { status } } }, { status }],
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

    const dataIncluded = await this.getCountDataDataIncluded(
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
      const queryResult = await this.prismaService.platformProductOrder.count({
        select: { _all: true },
        where: {
          ...graphQueryWhere(graphType, dateFrom, dateTo),
          ...queryWhere,
        },
      });
      const dataPoint: IGraphDataPoint = {
        value: queryResult._all,
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

  private async getCountProfitDataDataIncluded(
    {
      graphType,
      roundDateToDay,
      roundDateToMonth,
      includeOngoingPeriod,
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

          // return requested data, eg. percentage change
          return getChange(
            lastData._sum.amount?.toNumber() || 0,
            preLastData._sum.amount?.toNumber() || 0,
          );
        })();
      }
    }

    return dataIncluded;
  }

  async getClientsProfitCountData(
    userId: number,
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
    }: UserGraphParamsDto,
    { product }: ClientProductFilterParamsDto,
  ) {
    const queryWhere: Prisma.TransactionFlowWhereInput = {
      transactions: {
        every: {
          status: {
            in: [TransactionStatus.Approved, TransactionStatus.Pending],
          },
        },
      },
      type: TransactionFlowType.Comission,
      userId,
      productOrder: {
        platformProduct: product,
        status:
          product === 0 || product === 1 ? Status.Finished : Status.Delivered,
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

    const dataIncluded = await this.getCountProfitDataDataIncluded(
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
}
