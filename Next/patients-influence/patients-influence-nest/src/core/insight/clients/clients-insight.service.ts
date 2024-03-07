import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { UserStatus } from 'src/utils';
import { getNPeriods, getPeriods } from '../utils/period-generator';
import { GraphParamsDto } from '../dto/graph-params.dto';
import { ClientFilterParamsDto } from './dto/client-filter-params.dto';
import { Prisma } from '@prisma/client';
import { IGraphDataPoint } from '../interfaces/graph-data-point.interface';
import { IGraphResult } from '../interfaces/graph-result.interface';
import { graphQueryWhere } from '../utils/query-where';
import { ClientProductFilterParamsDto } from './dto/client-product-filter-params.dto';
import { PlatformProduct } from 'src/core/platform-product/enums/platform-product.enum';
import {
  ClientCampaignPerformanceFilterParamsDto,
  PerformanceType,
} from './dto/campaign-performance-filter-params.dto';
import { DiscoverClientFilterParamsDto } from './dto/discover-client-filter-params.dto';
import { UserGraphParamsDto } from '../dto/user-graph-params.dto';
import { GraphIncludeData } from '../enums/graph-include-data.enum';
import { GraphPeriod } from '../enums/graph-period.enum';
import { getChange } from '../utils/relative-change';
import { BadRequestApplicationException } from 'src/exceptions/application.exception';
import { ClientProductInfluencerFilterParamsDto } from './dto/client-product-influencer-filter-params.dto';
import { ProductOrderInfluencerStatus } from 'src/core/platform-product/enums/product-order-influencer-status.enum';

@Injectable()
export class ClientsInsightService {
  private readonly logger = new Logger(ClientsInsightService.name);

  constructor(private readonly prismaService: PrismaService) {}

  private async getClientsCountDataDataIncluded(
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
    queryWhere: Prisma.ClientWhereInput,
  ) {
    const dataIncluded: { GraphIncludeData?: number | 'N/A' } = {};

    if (!includeData) return dataIncluded; // no additional data is requested

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

      // first handle out-of-the-ordinary data (like "total"), then handle percentage-like data
      if (data === GraphIncludeData.total) {
        dataIncluded[data] = (
          await this.prismaService.client.count({
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

          const lastData = await this.prismaService.client.count({
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
          const preLastData = await this.prismaService.client.count({
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
    {
      status,
      statusAtPointOfTime,
      approvedOnly,
      industryId,
      hasProductOrder,
    }: ClientFilterParamsDto,
  ) {
    let queryWhere: Prisma.ClientWhereInput = {
      industryId,
    };

    if (statusAtPointOfTime || approvedOnly || status) {
      queryWhere = {
        ...queryWhere,
        user: statusAtPointOfTime
          ? {
              statusChangelog:
                approvedOnly !== undefined || status !== undefined
                  ? {
                      some: {
                        status: approvedOnly ? UserStatus.Approved : status,
                      },
                    }
                  : undefined,
            }
          : { status: approvedOnly ? UserStatus.Approved : status },
      };
    }

    if (hasProductOrder) {
      queryWhere = {
        ...queryWhere,
        platformProductOrder:
          hasProductOrder !== undefined
            ? hasProductOrder
              ? { some: {} }
              : { none: {} }
            : undefined,
      };
    }

    const periods = useStrictPeriod
      ? getPeriods(
          graphPeriod,
          undefined,
          {
            includeOngoingPeriod, // ? true
            roundDateToDay, // ? true
            roundDateToMonth,
            numOfLastPeriods: maxResults,
          },
          this.logger,
        )
      : await (async () => {
          // * first client based on filter criteria
          const client = await this.prismaService.client.aggregate({
            _min: { createdAt: true },
            where: { ...queryWhere },
          });

          return getNPeriods(
            undefined,
            undefined,
            client._min.createdAt,
            undefined,
            numberOfPoints,
          );
        })();
    const dataIncluded = await this.getClientsCountDataDataIncluded(
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
      const queryResult = await this.prismaService.client.count({
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

  private async getDiscoverClientsCountDataDataIncluded(
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
    queryWhere: Prisma.ClientWhereInput,
  ) {
    const dataIncluded: { GraphIncludeData?: number | 'N/A' } = {};

    if (!includeData) return dataIncluded; // no additional data is requested

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

      // first handle out-of-the-ordinary data (like "total"), then handle percentage-like data
      if (data === GraphIncludeData.total) {
        dataIncluded[data] = (
          await this.prismaService.client.count({
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

          const lastData = await this.prismaService.client.count({
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
          const preLastData = await this.prismaService.client.count({
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

  async getDiscoverClientsCountData(
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
    { status }: ClientFilterParamsDto,
  ) {
    const queryWhere: Prisma.ClientWhereInput = {
      // status,
      NOT: {
        platformProductOrder: {
          some: {},
        },
      },
    };
    const periods = useStrictPeriod
      ? getPeriods(
          graphPeriod,
          undefined,
          {
            includeOngoingPeriod, // ? true
            roundDateToDay, // ? true
            roundDateToMonth,
            numOfLastPeriods: maxResults,
          },
          this.logger,
        )
      : await (async () => {
          // * first discover client based on filter criteria
          const discoverClient = await this.prismaService.client.aggregate({
            _min: { createdAt: true },
            where: { ...queryWhere },
          });

          return getNPeriods(
            undefined,
            undefined,
            discoverClient._min.createdAt,
            undefined,
            numberOfPoints,
          );
        })();
    const dataIncluded = await this.getDiscoverClientsCountDataDataIncluded(
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
      const queryResult = await this.prismaService.client.count({
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

  private async getClientProductsCountDataDataIncluded(
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
    queryWhere: Prisma.PlatformProductOrderWhereInput,
  ) {
    const dataIncluded: { GraphIncludeData?: number | 'N/A' } = {};

    if (!includeData) return dataIncluded; // no additional data is requested

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

      // first handle out-of-the-ordinary data (like "total"), then handle percentage-like data
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

  // * covers campaigns, surveys, social media listenings and campaign reports (depends on "product" filter)
  async getClientProductsCountData(
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
    {
      status,
      statusAtPointOfTime,
      product,
      withNoReport,
    }: ClientProductFilterParamsDto,
  ) {
    const queryWhere: Prisma.PlatformProductOrderWhereInput = {
      client: { userId },
      platformProduct: product,
      status,
      campaignReports: withNoReport ? { none: {} } : undefined,
    };

    const periods = useStrictPeriod
      ? getPeriods(
          graphPeriod,
          undefined,
          {
            includeOngoingPeriod, // ? true
            roundDateToDay, // ? true
            roundDateToMonth,
            numOfLastPeriods: maxResults,
          },
          this.logger,
        )
      : await (async () => {
          if (startFromUserRegistration) {
            // * get to the user's creation date
            const user = await this.prismaService.user.findUniqueOrThrow({
              where: { id: userId },
              select: { createdAt: true },
            });

            return getNPeriods(
              undefined,
              undefined,
              user.createdAt,
              undefined,
              numberOfPoints,
            );
          }

          // * first product (campaign, survey...) based on filter criteria
          const platformProductOrder =
            await this.prismaService.platformProductOrder.aggregate({
              _min: { createdAt: true },
              where: { ...queryWhere },
            });

          return getNPeriods(
            undefined,
            undefined,
            platformProductOrder._min.createdAt,
            undefined,
            numberOfPoints,
          );
        })();
    const dataIncluded = await this.getClientProductsCountDataDataIncluded(
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
    /* }

    return cache; */
  }

  private async getClientProductInfluencersCountDataDataIncluded(
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
    queryWhere: Prisma.PlatformProductOrderInfluencerWhereInput,
  ) {
    const dataIncluded: { GraphIncludeData?: number | 'N/A' } = {};

    if (!includeData) return dataIncluded; // no additional data is requested

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

      // first handle out-of-the-ordinary data (like "total"), then handle percentage-like data
      if (data === GraphIncludeData.total) {
        dataIncluded[data] = (
          await this.prismaService.platformProductOrderInfluencer.count({
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

          const lastData =
            await this.prismaService.platformProductOrderInfluencer.count({
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
            await this.prismaService.platformProductOrderInfluencer.count({
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

  // * covers campaigns, surveys, social media listenings and campaign reports (depends on "product" filter)
  async getClientProductInfluencersCountData(
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
    {
      status,
      statusAtPointOfTime,
      product,
    }: ClientProductInfluencerFilterParamsDto,
  ) {
    if (
      product !== undefined &&
      ![PlatformProduct.Campaign, PlatformProduct.Survey].includes(product)
    ) {
      throw new BadRequestApplicationException(
        `Cannot select influencers of products that don't make sense to get influencers from`,
      );
    }

    const queryWhere: Prisma.PlatformProductOrderInfluencerWhereInput = {
      productOrder: {
        client: { userId },
        platformProduct: product,
        platformProductOrderInfluencers: {
          some: {
            status: ProductOrderInfluencerStatus.Paid,
          },
        },
      },
    };
    const periods = useStrictPeriod
      ? getPeriods(
          graphPeriod,
          undefined,
          {
            includeOngoingPeriod, // ? true
            roundDateToDay, // ? true
            roundDateToMonth,
            numOfLastPeriods: maxResults,
          },
          this.logger,
        )
      : await (async () => {
          if (startFromUserRegistration) {
            // * get to the user's creation date
            const user = await this.prismaService.user.findUniqueOrThrow({
              where: { id: userId },
              select: { createdAt: true },
            });

            return getNPeriods(
              undefined,
              undefined,
              user.createdAt,
              undefined,
              numberOfPoints,
            );
          }

          // * first product's influencer (campaign, survey...) based on filter criteria
          const platformProductOrderInfluencer =
            await this.prismaService.platformProductOrderInfluencer.aggregate({
              _min: { createdAt: true },
              where: { ...queryWhere },
            });

          return getNPeriods(
            undefined,
            undefined,
            platformProductOrderInfluencer._min.createdAt,
            undefined,
            numberOfPoints,
          );
        })();
    const dataIncluded =
      await this.getClientProductInfluencersCountDataDataIncluded(
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
        },
        queryWhere,
      );
    const result: IGraphResult = { data: [], ...dataIncluded };

    for (const { dateFrom, dateTo } of periods) {
      const queryResult =
        await this.prismaService.platformProductOrderInfluencer.count({
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

  private async getClientCampaignsPerformanceDataDataIncluded(
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
    {
      status,
      statusAtPointOfTime,
      performanceType,
    }: ClientCampaignPerformanceFilterParamsDto,
    queryWhere: Prisma.CampaignInfluencerPerformanceWhereInput,
  ) {
    const dataIncluded: { GraphIncludeData?: number | 'N/A' } = {};

    if (!includeData) return dataIncluded; // no additional data is requested

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

      // first handle out-of-the-ordinary data (like "total"), then handle percentage-like data
      if (data === GraphIncludeData.total) {
        const total =
          await this.prismaService.campaignInfluencerPerformance.aggregate({
            _sum: {
              ...(performanceType === PerformanceType.Likes
                ? { likes: true }
                : undefined),
              ...(performanceType === PerformanceType.Comments
                ? { comments: true }
                : undefined),
              ...(performanceType === PerformanceType.Reach
                ? { reach: true } // * this is delicate, as it can be relative and absolute (_sum will return correct value if individual record's value is absolute)
                : undefined),
              ...(performanceType === PerformanceType.WebsiteClicks
                ? { websiteClick: true }
                : undefined),
            },
            where: {
              ...graphQueryWhere(graphType, undefined, undefined),
              ...queryWhere,
            },
          });
        dataIncluded[data] =
          total._sum.likes ??
          total._sum.comments ??
          total._sum.reach?.toNumber() ??
          total._sum.websiteClick ??
          0;
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
            await this.prismaService.campaignInfluencerPerformance.aggregate({
              _sum: {
                ...(performanceType === PerformanceType.Likes
                  ? { likes: true }
                  : undefined),
                ...(performanceType === PerformanceType.Comments
                  ? { comments: true }
                  : undefined),
                ...(performanceType === PerformanceType.Reach
                  ? { reach: true } // * this is delicate, as it can be relative and absolute (_sum will return correct value if individual record's value is absolute)
                  : undefined),
                ...(performanceType === PerformanceType.WebsiteClicks
                  ? { websiteClick: true }
                  : undefined),
              },
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
            await this.prismaService.campaignInfluencerPerformance.aggregate({
              _sum: {
                ...(performanceType === PerformanceType.Likes
                  ? { likes: true }
                  : undefined),
                ...(performanceType === PerformanceType.Comments
                  ? { comments: true }
                  : undefined),
                ...(performanceType === PerformanceType.Reach
                  ? { reach: true } // * this is delicate, as it can be relative and absolute (_sum will return correct value if individual record's value is absolute)
                  : undefined),
                ...(performanceType === PerformanceType.WebsiteClicks
                  ? { websiteClick: true }
                  : undefined),
              },
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
            lastData._sum.likes ??
              lastData._sum.comments ??
              lastData._sum.reach?.toNumber() ??
              lastData._sum.websiteClick ??
              0,
            preLastData._sum.likes ??
              preLastData._sum.comments ??
              preLastData._sum.reach?.toNumber() ??
              preLastData._sum.websiteClick ??
              0,
          );
        })();
      }
    }

    return dataIncluded;
  }

  async getClientCampaignsPerformanceData(
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
    {
      status,
      statusAtPointOfTime,
      performanceType,
    }: ClientCampaignPerformanceFilterParamsDto,
  ) {
    const queryWhere: Prisma.CampaignInfluencerPerformanceWhereInput = {
      campaign: {
        platformProductOrder: {
          client: { userId },
          platformProduct: PlatformProduct.Campaign,
          ...(statusAtPointOfTime
            ? { statusChangelog: { some: { status } } }
            : { status }),
        },
      },
    };
    const periods = useStrictPeriod
      ? getPeriods(
          graphPeriod,
          undefined,
          {
            includeOngoingPeriod, // ? true
            roundDateToDay, // ? true
            roundDateToMonth,
            numOfLastPeriods: maxResults,
          },
          this.logger,
        )
      : await (async () => {
          if (startFromUserRegistration) {
            // * get to the user's creation date
            const user = await this.prismaService.user.findUniqueOrThrow({
              where: { id: userId },
              select: { createdAt: true },
            });

            return getNPeriods(
              undefined,
              undefined,
              user.createdAt,
              undefined,
              numberOfPoints,
            );
          }

          // * first campaign based on filter criteria (NPeriod points are based on the first campaign, not first performance occurrence)
          const platformProductOrder =
            await this.prismaService.platformProductOrder.aggregate({
              _min: { createdAt: true },
              where: { ...queryWhere }, // ! same query as for campaignInfluencerPerformance is compatible for platformProductOrder
            });

          return getNPeriods(
            undefined,
            undefined,
            platformProductOrder._min.createdAt,
            undefined,
            numberOfPoints,
          );
        })();
    const dataIncluded =
      await this.getClientCampaignsPerformanceDataDataIncluded(
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
        },
        {
          status,
          statusAtPointOfTime,
          performanceType,
        },
        queryWhere,
      );
    const result: IGraphResult = { data: [], ...dataIncluded };

    for (const { dateFrom, dateTo } of periods) {
      const queryResult =
        await this.prismaService.campaignInfluencerPerformance.aggregate({
          _sum: {
            ...(performanceType === PerformanceType.Likes
              ? { likes: true }
              : undefined),
            ...(performanceType === PerformanceType.Comments
              ? { comments: true }
              : undefined),
            ...(performanceType === PerformanceType.Reach
              ? { reach: true } // * this is delicate, as it can be relative and absolute (_sum will return correct value if individual record's value is absolute)
              : undefined),
            ...(performanceType === PerformanceType.WebsiteClicks
              ? { websiteClick: true }
              : undefined),
          },
          where: {
            ...graphQueryWhere(graphType, dateFrom, dateTo),
            ...queryWhere,
          },
        });
      const dataPoint: IGraphDataPoint = {
        value:
          queryResult._sum.likes ??
          queryResult._sum.comments ??
          queryResult._sum.reach?.toNumber() ??
          queryResult._sum.websiteClick ??
          0,
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

  private async getClientRecommendedOverTimeDataIncludeData(
    {
      graphType,
      roundDateToDay,
      roundDateToMonth,
      includeOngoingPeriod,
      includeData,
    }: UserGraphParamsDto,
    queryWhere: Prisma.DiseaseAreaWhereInput,
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
          await this.prismaService.diseaseArea.count({
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

          const lastData = await this.prismaService.diseaseArea.count({
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
          const preLastData = await this.prismaService.diseaseArea.count({
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

  async getClientRecommendedOverTimeData(
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
  ) {
    const client = await this.prismaService.client.findUniqueOrThrow({
      where: { userId },
    });

    const queryWhere: Prisma.DiseaseAreaWhereInput = {
      clientDiseaseAreas: { some: { clientId: client.id } },
      platformProductOrderDiseaseAreas: {
        none: {
          productOrder: { clientId: client.id },
        },
      },
    };

    const periods = useStrictPeriod
      ? getPeriods(
          graphPeriod,
          undefined,
          {
            includeOngoingPeriod, // ? true
            roundDateToDay, // ? true
            roundDateToMonth,
            numOfLastPeriods: maxResults,
          },
          this.logger,
        )
      : await (async () => {
          if (startFromUserRegistration) {
            // * get to the user's creation date
            const user = await this.prismaService.user.findUniqueOrThrow({
              where: { id: userId },
              select: { createdAt: true },
            });

            return getNPeriods(
              undefined,
              undefined,
              user.createdAt,
              undefined,
              numberOfPoints,
            );
          }

          const platformProductOrder =
            await this.prismaService.diseaseArea.aggregate({
              _min: { createdAt: true },
              where: { ...queryWhere },
            });

          return getNPeriods(
            undefined,
            undefined,
            platformProductOrder._min.createdAt,
            undefined,
            numberOfPoints,
          );
        })();

    const dataIncluded = await this.getClientRecommendedOverTimeDataIncludeData(
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
      },
      queryWhere,
    );

    const result: IGraphResult = { data: [], ...dataIncluded };

    for (const { dateFrom, dateTo } of periods) {
      const queryResult = await this.prismaService.diseaseArea.count({
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
}
