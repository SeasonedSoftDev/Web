import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { getPeriods } from '../utils/period-generator';
import { GraphParamsDto } from '../dto/graph-params.dto';
import { Prisma } from '@prisma/client';
import { IGraphDataPoint } from '../interfaces/graph-data-point.interface';
import { IGraphResult } from '../interfaces/graph-result.interface';
import { graphQueryWhere } from '../utils/query-where';
import { PlatformProduct } from 'src/core/platform-product/enums/platform-product.enum';
import { Status } from 'src/core/campaign/enums/status.enum';
import { CampaignFilterParamsDto } from '../campaigns/dto/filter-params.dto';
import { GraphIncludeData } from '../enums/graph-include-data.enum';
import { GraphPeriod } from '../enums/graph-period.enum';
import { getChange } from '../utils/relative-change';
import { ReportType } from 'src/core/campaign/enums';

@Injectable()
export class ReportsInsightService {
  private readonly logger = new Logger(ReportsInsightService.name);

  constructor(private readonly prismaService: PrismaService) {}

  private async getReportsCountDataDataIncluded(
    {
      graphType,
      roundDateToDay,
      roundDateToMonth,
      includeOngoingPeriod,
      includeData,
    }: GraphParamsDto,
    queryWhere: Prisma.CampaignReportWhereInput,
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
          await this.prismaService.campaignReport.count({
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

          const lastData = await this.prismaService.campaignReport.count({
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
          const preLastData = await this.prismaService.campaignReport.count({
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

          return getChange(lastData._all, preLastData._all);
        })();
      }
    }

    return dataIncluded;
  }

  async getReportsCountData(
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
    { status }: CampaignFilterParamsDto,
  ) {
    const queryWhere: Prisma.CampaignReportWhereInput = {
      platformProductOrder: { status },
      reportType: ReportType.Yes,
    };

    const periods = getPeriods(
      graphPeriod,
      undefined,
      {
        includeOngoingPeriod,
        roundDateToDay,
        roundDateToMonth,
        numOfLastPeriods: maxResults,
      },
      this.logger,
    );

    const dataIncluded = await this.getReportsCountDataDataIncluded(
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
      const queryResult = await this.prismaService.campaignReport.count({
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

  private async getReportsRevenueDataDataIncluded(
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
          return getChange(
            lastData._sum.budget ? lastData._sum.budget.toNumber() : 0,
            preLastData._sum.budget ? preLastData._sum.budget.toNumber() : 0,
          );
        })();
      }
    }

    return dataIncluded;
  }

  async getReportsRevenueData({
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
    const queryWhere: Prisma.PlatformProductOrderWhereInput = {
      platformProduct: PlatformProduct.CampaignReport,
      status: { in: [Status.Finished, Status.OnGoing] },
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

    const dataIncluded = await this.getReportsRevenueDataDataIncluded(
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
}
