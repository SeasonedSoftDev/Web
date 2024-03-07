import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { IInfluencersCount } from './interfaces/influencers-count.interface';
import { TransactionFlowType, TransactionStatus, UserStatus } from 'src/utils';
import { getLastIntervals } from '../utils/time-interval';
import { getChange } from '../utils/relative-change';
import { GraphPeriod } from '../enums/graph-period.enum';
import { GraphType } from '../enums/graph-type.enum';
import { getNPeriods, getPeriods } from '../utils/period-generator';
import { GraphParamsDto } from '../dto/graph-params.dto';
import { InfluencerFilterParamsDto } from './dto/influencer-filter-params.dto';
import { Prisma } from '@prisma/client';
import { mean, standardDeviation } from 'simple-statistics';
import { IGraphDataPoint } from '../interfaces/graph-data-point.interface';
import { GraphResultEntity } from '../entities/graph-result.entity';
import { IGraphResult } from '../interfaces/graph-result.interface';
import { InfluencerCampaignFilterParamsDto } from './dto/campaign-filter-params.dto';
import { Status } from 'src/core/campaign/enums/status.enum';
import { graphQueryWhere } from '../utils/query-where';
import { PlatformProduct } from 'src/core/platform-product/enums/platform-product.enum';
import { InfluencerFinanceFilterParamsDto } from './dto/finance-filter-params.dto copy';
import { InfluencerBenefitFilterParamsDto } from './dto/benefit-filter-param.dto';
import { InfluencerService } from 'src/core/influencer/influencer.service';
import { SMLGraphParamsDto } from '../sml/dto/sml-graph-params.dto';
import { StakeholderType } from 'src/utils/enums/stakeholder-type.enum';
import { id } from 'date-fns/locale';
import { SocialPlatform } from 'src/core/stakeholders/enums/social-platform.enum';
import { PostType } from 'src/core/influencer/subroutes/desired-income/campaign/enums/post-type.enum';
import { SurveyType } from 'src/core/influencer/subroutes/desired-income/survey/enums/survey-type.enum';
import { addDays } from 'date-fns';
import { DesiredAmountResultMetadata } from './dto/results/desired-amount-result-metadata.dto';
import { UserGraphParamsDto } from '../dto/user-graph-params.dto';
import { GraphIncludeData } from '../enums/graph-include-data.enum';
import { ProductOrderInfluencerStatus } from 'src/core/platform-product/enums/product-order-influencer-status.enum';

@Injectable()
export class InfluencersInsightService {
  private readonly logger = new Logger(InfluencersInsightService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly influencersService: InfluencerService,
  ) {}

  /* getGraph(graphPeriod?: GraphPeriod, max?: number, graphType?: GraphType) {
    const periods = getPeriods(graphPeriod, undefined, {
      includeLastDynamicPeriod: true,
      roundDateToDay: true,
      numOfLastPeriods: max,
    });

    return periods;
  } */

  /* async getGraph(interval: TimeInterval, graphPeriod?: GraphPeriod, graphType?: GraphType) {
    
    const timeIntervals = getLastIntervals(undefined, true);
    const nodes = await this.getInfluencers(
      timeIntervals.oneDayAgo,
      timeIntervals.date,
      interval,
    );
    const filteredNodes = this.filterNodesByPeriod(nodes, period);
    const nodeIds = filteredNodes.map((node) => node.id);
    const edges = await this.graphService.getEdgesForNodes(nodeIds);
  } */

  // async countNewInfluencers() {
  //   const timeIntervals = getLastIntervals(undefined, true);

  //   const [
  //     influencers24hCount,
  //     influencers1wCount,
  //     influencers1MCount,
  //     influencers1YCount,
  //     influencersOld24hCount,
  //     influencersOld1wCount,
  //     influencersOld1MCount,
  //     influencersOld1YCount,
  //   ] = await Promise.all([
  //     //#region count newest influencers
  //     this.prismaService.influencer.count({
  //       where: { createdAt: { gte: timeIntervals.oneDayAgo } },
  //     }),
  //     this.prismaService.influencer.count({
  //       where: { createdAt: { gte: timeIntervals.oneWeekAgo } },
  //     }),
  //     this.prismaService.influencer.count({
  //       where: { createdAt: { gte: timeIntervals.oneMonthAgo } },
  //     }),
  //     this.prismaService.influencer.count({
  //       where: { createdAt: { gte: timeIntervals.oneYearAgo } },
  //     }),
  //     //#endregion
  //     //#region count previously-newest influencers
  //     this.prismaService.influencer.count({
  //       where: {
  //         createdAt: {
  //           gte: timeIntervals.twoDaysAgo,
  //           lt: timeIntervals.oneDayAgo,
  //         },
  //       },
  //     }),
  //     this.prismaService.influencer.count({
  //       where: {
  //         createdAt: {
  //           gte: timeIntervals.twoWeeksAgo,
  //           lt: timeIntervals.oneWeekAgo,
  //         },
  //       },
  //     }),
  //     this.prismaService.influencer.count({
  //       where: {
  //         createdAt: {
  //           gte: timeIntervals.twoMonthsAgo,
  //           lt: timeIntervals.oneMonthAgo,
  //         },
  //       },
  //     }),
  //     this.prismaService.influencer.count({
  //       where: {
  //         createdAt: {
  //           gte: timeIntervals.twoYearsAgo,
  //           lt: timeIntervals.oneYearAgo,
  //         },
  //       },
  //     }),
  //     //#endregion
  //   ]);

  //   return {
  //     lastDay: {
  //       total: influencers24hCount,
  //       changePercentage: getChange(
  //         influencers24hCount,
  //         influencersOld24hCount,
  //       ),
  //     },
  //     lastWeek: {
  //       total: influencers1wCount,
  //       changePercentage: getChange(influencers1wCount, influencersOld1wCount),
  //     },
  //     lastMonth: {
  //       total: influencers1MCount,
  //       changePercentage: getChange(influencers1MCount, influencersOld1MCount),
  //     },
  //     lastYear: {
  //       total: influencers1YCount,
  //       changePercentage: getChange(influencers1YCount, influencersOld1YCount),
  //     },
  //   };

  //   /* // count influencers in last 24h
  //   const influencers24hCount = await this.prismaService.influencer.count({
  //     where: { createdAt: { gte: timeIntervals.oneDayAgo } },
  //   });
  //   const influencers1wCount = await this.prismaService.influencer.count({
  //     where: { createdAt: { gte: timeIntervals.oneWeekAgo } },
  //   });
  //   const influencers1MCount = await this.prismaService.influencer.count({
  //     where: { createdAt: { gte: timeIntervals.oneMonthAgo } },
  //   });
  //   const influencers1YCount = await this.prismaService.influencer.count({
  //     where: { createdAt: { gte: timeIntervals.oneYearAgo } },
  //   });

  //   const influencersOld24hCount = await this.prismaService.influencer.count({
  //     where: { createdAt: { gte: timeIntervals.twoDaysAgo, lt: timeIntervals.oneDayAgo } },
  //   });
  //   const influencersOld1wCount = await this.prismaService.influencer.count({
  //     where: { createdAt: { gte: timeIntervals.twoWeeksAgo, lt: timeIntervals.oneWeekAgo } },
  //   });
  //   const influencersOld1MCount = await this.prismaService.influencer.count({
  //     where: { createdAt: { gte: timeIntervals.twoMonthsAgo, lt: timeIntervals.oneMonthAgo } },
  //   });
  //   const influencersOld1YCount = await this.prismaService.influencer.count({
  //     where: { createdAt: { gte: timeIntervals.twoYearsAgo, lt: timeIntervals.oneYearAgo } },
  //   }); */
  // }

  async *influencers(
    querySelect: Prisma.InfluencerCountAggregateInputType,
    periods: {
      dateFrom: Date;
      dateTo: Date;
    }[],
    graphType?: GraphType,
    queryWhere?: Prisma.InfluencerWhereInput,
  ): AsyncIterable<IGraphDataPoint> {
    for (const { dateFrom, dateTo } of periods) {
      const result = await this.prismaService.influencer.count({
        select: querySelect, // { _all: true },
        where: {
          createdAt:
            graphType === GraphType.Cumulative
              ? { lte: dateTo }
              : { gte: dateFrom, lte: dateTo },
          ...queryWhere,
        },
      });

      yield {
        value: result._all,
        timestamp: dateFrom,
        dateFrom,
        dateTo,
      };
    }
  }

  private async getInfluencersCountDataDataIncluded(
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
    queryWhere: Prisma.InfluencerWhereInput,
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
          await this.prismaService.influencer.count({
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

          const lastData = await this.prismaService.influencer.count({
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
          const preLastData = await this.prismaService.influencer.count({
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

  async getInfluencersCountData(
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
      socialPlatform,
      approvedOnly,
    }: InfluencerFilterParamsDto,
  ) {
    const queryWhere: Prisma.InfluencerWhereInput = {
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
      // stakeholders:
      //   socialPlatform !== undefined
      //     ? {
      //         some: {
      //           // TODO review ER diagram on social platforms and refactor the line below
      //           socialPlatformId: socialPlatform,
      //         },
      //       }
      //     : undefined,
      instagramUsername: socialPlatform
        ? {
            not: '',
          }
        : undefined,
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
          // * first influencer based on filter criteria
          const influencer = await this.prismaService.influencer.aggregate({
            _min: { createdAt: true },
            where: { ...queryWhere },
          });

          return getNPeriods(
            undefined,
            undefined,
            influencer._min.createdAt,
            undefined,
            numberOfPoints,
          );
        })();
    const dataIncluded = await this.getInfluencersCountDataDataIncluded(
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
      const queryResult = await this.prismaService.influencer.count({
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

  private async getInfluencerCampaignsCountDataDataIncluded(
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

  async getInfluencerCampaignsCountData(
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
    { status }: InfluencerCampaignFilterParamsDto,
  ) {
    const queryWhere: Prisma.PlatformProductOrderInfluencerWhereInput = {
      productOrder: {
        platformProduct: PlatformProduct.Campaign,
        status,
      },
      influencer: {
        userId,
      },
      status: {
        in: [
          ProductOrderInfluencerStatus.Invited,
          ProductOrderInfluencerStatus.Matching,
          ProductOrderInfluencerStatus.ToBeSubmitted,
          ProductOrderInfluencerStatus.ToBeApproved,
          ProductOrderInfluencerStatus.NotApproved,
          ProductOrderInfluencerStatus.Approved,
          ProductOrderInfluencerStatus.Paid,
          ProductOrderInfluencerStatus.ToBePaid,
          ProductOrderInfluencerStatus.ToBeAnswered,
        ],
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

    const dataIncluded = await this.getInfluencerCampaignsCountDataDataIncluded(
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

  async getInfluencerSurveysCountData(
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
    { status }: InfluencerCampaignFilterParamsDto,
  ) {
    const queryWhere: Prisma.PlatformProductOrderInfluencerWhereInput = {
      influencer: { userId },
      productOrder: {
        platformProduct: PlatformProduct.Survey,
        status,
      },
      status: {
        in: [
          ProductOrderInfluencerStatus.Invited,
          ProductOrderInfluencerStatus.Matching,
          ProductOrderInfluencerStatus.ToBeSubmitted,
          ProductOrderInfluencerStatus.ToBeApproved,
          ProductOrderInfluencerStatus.NotApproved,
          ProductOrderInfluencerStatus.Approved,
          ProductOrderInfluencerStatus.Paid,
          ProductOrderInfluencerStatus.ToBePaid,
          ProductOrderInfluencerStatus.ToBeAnswered,
        ],
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

    const dataIncluded = await this.getInfluencerCampaignsCountDataDataIncluded(
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

  private async getInfluencerPlatformProductsIncomeDataDataIncluded(
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

  async getInfluencerPlatformProductsIncomeData(
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
    { platformProduct }: InfluencerFinanceFilterParamsDto,
  ) {
    // TODO review source of income information (agreed amount vs transaction)
    const queryWhere: Prisma.TransactionFlowWhereInput = {
      productOrder: {
        platformProductOrderInfluencers: {
          some: { influencer: { userId } },
        },
        // TODO review ER diagram on platform products and refactor the line below
        platformProduct: platformProduct,
      },
      // TODO review type of transaction
      type: { in: [TransactionFlowType.Donation, TransactionFlowType.Salary] },
      transactions: {
        every: {
          status: {
            in: [TransactionStatus.Approved, TransactionStatus.Pending],
          },
        },
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

    const dataIncluded =
      await this.getInfluencerPlatformProductsIncomeDataDataIncluded(
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

  async getInfluencerAffiliateIncomeData(
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
    const queryWhere: Prisma.TransactionFlowWhereInput = {
      productOrder: {
        platformProductOrderInfluencers: {
          some: { influencer: { userId } },
        },
      },
      type: TransactionFlowType.Affiliate,
      transactions: {
        some: {
          status: TransactionStatus.Approved,
        },
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

    const dataIncluded =
      await this.getInfluencerPlatformProductsIncomeDataDataIncluded(
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

  // TODO review because of influencer (benefit is not related to the influencer, but benefit suggestion is)
  async getInfluencerBenefitsData(
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
    { approvedOnly, categoryId }: InfluencerBenefitFilterParamsDto,
  ) {
    const queryWhere: Prisma.BenefitSuggestionWhereInput = {
      authorId: userId,
      isApproved: approvedOnly ? true : false,
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
    const result: IGraphResult = { data: [] };

    for (const { dateFrom, dateTo } of periods) {
      // ! not benefitSuggestion
      const queryResult = await this.prismaService.benefit.count({
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

  /* async countInfluencersBySocialPlatform() {
    const stakeholderInfluencers = await this.prismaService.stakeholder.groupBy(
      {
        by: ['socialPlatformId'],
        _count: {
          _all: true,
        },
        where: {
          // influencerId: { not: null },
          influencer: { user: { status: UserStatus.Approved } },
        },
      },
    );
    const socialPlatforms = await this.prismaService.socialPlatform.findMany();

    return stakeholderInfluencers.reduce(
      (acc, stakeholderInfluencer): IInfluencersCount => {
        acc[
          socialPlatforms.find(
            (socialPlatform) =>
              socialPlatform.id === stakeholderInfluencer.socialPlatformId,
          ).name
        ] = stakeholderInfluencer._count._all;

        return acc;
      },
      {},
    );
  } */

  async location(
    id: number,
    {
      skip,
      take,
      graphType, // ! ignored
      includePeriodBorders, // ! ignored
      numberOfPoints, // ! ignored
    }: SMLGraphParamsDto,
  ) {
    // verify if influencer exists
    const influencer = await this.prismaService.influencer.findUniqueOrThrow({
      include: {
        _count: {
          select: {
            influencerFollowers: true,
          },
        },
      },
      where: { userId: id },
    });

    const followerLocations = await this.prismaService.stakeholder.groupBy({
      by: ['locationId'],
      // count stakeholders within location (location group)
      _count: { id: true },
      where: {
        influencerFollowers: {
          some: {
            influencerId: id,
            stakeholder: {
              type: { not: StakeholderType.NonMedical },
            },
          },
        },
        // * take countries only
        location: {
          country: { is: null },
        },
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      skip: skip,
      take: take,
    });
    const locations = await this.prismaService.location.findMany({
      where: {
        id: { in: followerLocations.map((location) => location.locationId) },
      },
    });
    const followersWithoutLocations =
      await this.prismaService.stakeholder.count({
        where: {
          influencerFollowers: {
            some: {
              influencerId: id,
              stakeholder: {
                type: { not: StakeholderType.NonMedical },
              },
            },
          },
          location: { is: null },
        },
      });

    // nurse = 40, patient = 40
    // nurse_USA = 20, patient_USA = 10
    // nurse_n_patient_UNKNOWN = 20 + 30 = 50
    // location._count.id = 30
    // influencer._count.influencerFollowers = 80
    // location._count.id / influencer._count.influencerFollowers = 30 / 80 = 0.375
    // followersWithoutLocations = nurse_n_patient_UNKNOWN = 50
    // followers = 30 + 50 * (30 / 80) = 30 + 18.75 = 48.75 ~ 49
    // * (30 => 49 | known = 30, unknown = 50)

    const result = followerLocations.map((location) => ({
      locationId: location.locationId,
      location: locations.find((loc) => loc.id === location.locationId)?.name,
      followersPercentage:
        location._count.id / influencer._count.influencerFollowers,
      followers: Math.round(
        location._count.id +
          followersWithoutLocations *
            (location._count.id / influencer._count.influencerFollowers),
      ),
    }));

    return result;
  }

  async city(
    id: number,
    {
      skip,
      take,
      graphType, // ! ignored
      includePeriodBorders, // ! ignored
      numberOfPoints, // ! ignored
    }: SMLGraphParamsDto,
  ) {
    // verify if influencer exists
    const influencer = await this.prismaService.influencer.findUniqueOrThrow({
      include: {
        _count: {
          select: {
            influencerFollowers: true,
          },
        },
      },
      where: { userId: id },
    });

    const followerLocations = await this.prismaService.stakeholder.groupBy({
      by: ['locationId'],
      // count stakeholders within location (location group)
      _count: { id: true },
      where: {
        influencerFollowers: {
          some: {
            influencerId: id,
            stakeholder: {
              type: { not: StakeholderType.NonMedical },
            },
          },
        },
        // * take cities only
        location: {
          country: { isNot: null },
        },
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      skip: skip,
      take: take,
    });
    const locations = await this.prismaService.location.findMany({
      where: {
        id: { in: followerLocations.map((location) => location.locationId) },
      },
    });
    const followersWithoutLocations =
      await this.prismaService.stakeholder.count({
        where: {
          influencerFollowers: {
            some: {
              influencerId: id,
              stakeholder: {
                type: { not: StakeholderType.NonMedical },
              },
            },
          },
          location: { is: null },
        },
      });

    const result = followerLocations.map((location) => ({
      locationId: location.locationId,
      location: locations.find((loc) => loc.id === location.locationId)?.name,
      followersPercentage:
        location._count.id / influencer._count.influencerFollowers,
      followers: Math.round(
        location._count.id +
          followersWithoutLocations *
            (location._count.id / influencer._count.influencerFollowers),
      ),
    }));

    return result;
  }

  async audience(id: number) {
    // verify if influencer exists
    const influencer = await this.prismaService.influencer.findUniqueOrThrow({
      include: {
        _count: {
          select: {
            influencerFollowers: true,
          },
        },
        stakeholders: true,
      },
      where: { userId: id },
    });

    const followerTypes = await this.prismaService.stakeholder.groupBy({
      by: ['type'],
      // count stakeholders
      _count: { id: true },
      where: {
        influencerFollowers: {
          some: {
            influencerId: id,
          },
        },
      },
    });

    const result = followerTypes.map((followerType) => ({
      followerType: followerType.type,
      followerTypeSize: followerType._count.id,
    }));
    result.push({
      followerType: StakeholderType.NonMedical,
      followerTypeSize:
        // * same as stakeholder.followersCount
        // influencer._count.influencerFollowers -
        // ! important to take from ML, and not aggregated
        influencer.stakeholders[0].followersCount -
        followerTypes
          .map((followerType) => followerType._count.id)
          .reduce((sum, c) => sum + c, 0),
    });

    return result;
  }

  /* async language(id: number) {
    // verify if influencer exists
    const influencer = await this.prismaService.influencer.findUniqueOrThrow({
      include: {
        _count: {
          select: {
            influencerFollowers: true,
          },
        },
      },
      where: { userId: id },
    });



    const [totalInfluencerFollowers, followerTypes] = await Promise.all([
      this.prismaService.influencer.findMany({
        include: {
          _count: {
            select: {
              influencerFollowers: true,
            },
          },
        },
        where: {
          id,
        },
      }),
      this.prismaService.stakeholder.groupBy({
        by: ['type'],
        // count stakeholders
        _count: { id: true },
        where: {
          influencerFollowers: {
            some: {
              influencerId: id,
              influencer: {
                userId: id,
                language
              }
            },
          },
        },
      }),
    ]);
    const result = followerTypes.map((followerType) => ({
      followerType: followerType.type,
      followerTypeSize: followerType._count.id,
    }));
    result.push({
      followerType: StakeholderType.NonMedical,
      followerTypeSize:
        totalInfluencerFollowers[0]._count.influencerFollowers -
        followerTypes
          .map((followerType) => followerType._count.id)
          .reduce((sum, c) => sum + c, 0),
    });

    return result;
  } */

  //#region PERFORMANCE
  async totalProjects(userId: number, dateStart?: Date, dateEnd?: Date) {
    // check if influencer exists
    const influencer = await this.influencersService.findOne(userId);

    //#region CAMPAIGNS
    const campaignProjectsCountInfluencer =
      await this.prismaService.platformProductOrderInfluencer.count({
        distinct: 'productOrderId',
        where: {
          influencer: { user: { id: userId, status: UserStatus.Approved } },
          productOrder: {
            platformProduct: PlatformProduct.Campaign,
          },
          createdAt: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
      });
    const [campaignProjectsCount, campaignInfluencersCount] = await Promise.all(
      [
        this.prismaService.platformProductOrderInfluencer.count({
          distinct: 'productOrderId',
          where: {
            influencer: { user: { status: UserStatus.Approved } },
            productOrder: {
              platformProduct: PlatformProduct.Campaign,
            },
            createdAt: {
              gte: dateStart,
              lte: dateEnd,
            },
          },
        }),
        this.prismaService.platformProductOrderInfluencer.count({
          distinct: 'influencerId',
          where: {
            influencer: { user: { status: UserStatus.Approved } },
            productOrder: {
              platformProduct: PlatformProduct.Campaign,
            },
            createdAt: {
              gte: dateStart,
              lte: dateEnd,
            },
          },
        }),
      ],
    );
    const campaignProjectsCountAverage =
      campaignProjectsCount / campaignInfluencersCount;
    //#endregion

    //#region SURVEYS
    const surveyProjectsCountInfluencer =
      await this.prismaService.platformProductOrderInfluencer.count({
        distinct: 'productOrderId',
        where: {
          influencer: { user: { id: userId, status: UserStatus.Approved } },
          productOrder: {
            platformProduct: PlatformProduct.Survey,
          },
          createdAt: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
      });
    const [surveyProjectsCount, surveyInfluencersCount] = await Promise.all([
      this.prismaService.platformProductOrderInfluencer.count({
        distinct: 'productOrderId',
        where: {
          influencer: { user: { status: UserStatus.Approved } },
          productOrder: {
            platformProduct: PlatformProduct.Survey,
          },
          createdAt: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
      }),
      this.prismaService.platformProductOrderInfluencer.count({
        distinct: 'influencerId',
        where: {
          influencer: { user: { status: UserStatus.Approved } },
          productOrder: {
            platformProduct: PlatformProduct.Survey,
          },
          createdAt: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
      }),
    ]);
    const surveyProjectsCountAverage =
      surveyProjectsCount / surveyInfluencersCount;
    //#endregion

    return {
      campaignProjectsCountInfluencer,
      campaignProjectsCountAverage,
      surveyProjectsCountInfluencer,
      surveyProjectsCountAverage,
    };
  }

  async totalProjects30Days(userId: number) {
    const dateStart = addDays(new Date(), -30);
    dateStart.setHours(0, 0, 0, 0);

    return await this.totalProjects(userId, dateStart);
  }

  async totalEarnings(
    userId: number,
    projectId?: number,
    dateStart?: Date,
    dateEnd?: Date,
  ) {
    // check if influencer exists
    const influencer = await this.influencersService.findOne(userId);

    //#region CAMPAIGNS
    const campaignTotalEarningsInfluencer =
      await this.prismaService.platformProductOrderInfluencer.aggregate({
        _sum: { agreedAmount: true },
        where: {
          influencer: { user: { id: userId, status: UserStatus.Approved } },
          productOrder: {
            id: projectId,
            platformProduct: PlatformProduct.Campaign,
            transactionFlows: {
              some: {
                // * single transaction flow amount HAS TO MATCH agreed amount (+ optional donation)
                // * => if condition from above is not matched, query will give invalid result
                type: { notIn: [TransactionFlowType.Withdrawal] },
                transactions: {
                  some: {
                    status: TransactionStatus.Approved,
                    createdAt: {
                      gte: dateStart,
                      lte: dateEnd,
                    },
                  },
                },
              },
            },
          },
          /* createdAt: {
            gte: dateStart,
            lte: dateEnd,
          }, */
        },
      });
    const [campaignTotalEarnings, campaignInfluencersCount] = await Promise.all(
      [
        this.prismaService.platformProductOrderInfluencer.aggregate({
          _sum: { agreedAmount: true },
          where: {
            influencer: { user: { status: UserStatus.Approved } },
            productOrder: {
              id: projectId,
              platformProduct: PlatformProduct.Campaign,
              transactionFlows: {
                some: {
                  // * single transaction flow amount HAS TO MATCH agreed amount (+ optional donation)
                  // * => if condition from above is not matched, query will give invalid result
                  type: { notIn: [TransactionFlowType.Withdrawal] },
                  transactions: {
                    some: {
                      status: TransactionStatus.Approved,
                      createdAt: {
                        gte: dateStart,
                        lte: dateEnd,
                      },
                    },
                  },
                },
              },
            },
            /* createdAt: {
              gte: dateStart,
              lte: dateEnd,
            }, */
          },
        }),
        this.prismaService.platformProductOrderInfluencer.count({
          distinct: 'influencerId',
          where: {
            influencer: { user: { status: UserStatus.Approved } },
            productOrder: {
              id: projectId,
              platformProduct: PlatformProduct.Campaign,
              transactionFlows: {
                some: {
                  // * single transaction flow amount HAS TO MATCH agreed amount (+ optional donation)
                  // * => if condition from above is not matched, query will give invalid result
                  type: { notIn: [TransactionFlowType.Withdrawal] },
                  transactions: {
                    some: {
                      status: TransactionStatus.Approved,
                      createdAt: {
                        gte: dateStart,
                        lte: dateEnd,
                      },
                    },
                  },
                },
              },
            },
            /* createdAt: {
              gte: dateStart,
              lte: dateEnd,
            }, */
          },
        }),
      ],
    );
    const campaignTotalEarningsAverage =
      campaignTotalEarnings._sum.agreedAmount.toNumber() /
      campaignInfluencersCount;
    //#endregion

    //#region SURVEYS
    const surveyTotalEarningsInfluencer =
      await this.prismaService.platformProductOrderInfluencer.aggregate({
        _sum: { agreedAmount: true },
        where: {
          influencer: { user: { id: userId, status: UserStatus.Approved } },
          productOrder: {
            id: projectId,
            platformProduct: PlatformProduct.Survey,
            transactionFlows: {
              some: {
                // * single transaction flow amount HAS TO MATCH agreed amount (+ optional donation)
                // * => if condition from above is not matched, query will give invalid result
                type: { notIn: [TransactionFlowType.Withdrawal] },
                transactions: {
                  some: {
                    status: TransactionStatus.Approved,
                    createdAt: {
                      gte: dateStart,
                      lte: dateEnd,
                    },
                  },
                },
              },
            },
          },
          /* createdAt: {
            gte: dateStart,
            lte: dateEnd,
          }, */
        },
      });
    const [surveyTotalEarnings, surveyInfluencersCount] = await Promise.all([
      this.prismaService.platformProductOrderInfluencer.aggregate({
        _sum: { agreedAmount: true },
        where: {
          influencer: { user: { status: UserStatus.Approved } },
          productOrder: {
            id: projectId,
            platformProduct: PlatformProduct.Survey,
            transactionFlows: {
              some: {
                // * single transaction flow amount HAS TO MATCH agreed amount (+ optional donation)
                // * => if condition from above is not matched, query will give invalid result
                type: { notIn: [TransactionFlowType.Withdrawal] },
                transactions: {
                  some: {
                    status: TransactionStatus.Approved,
                    createdAt: {
                      gte: dateStart,
                      lte: dateEnd,
                    },
                  },
                },
              },
            },
          },
          /* createdAt: {
            gte: dateStart,
            lte: dateEnd,
          }, */
        },
      }),
      this.prismaService.platformProductOrderInfluencer.count({
        distinct: 'influencerId',
        where: {
          influencer: { user: { status: UserStatus.Approved } },
          productOrder: {
            id: projectId,
            platformProduct: PlatformProduct.Survey,
            transactionFlows: {
              some: {
                // * single transaction flow amount HAS TO MATCH agreed amount (+ optional donation)
                // * => if condition from above is not matched, query will give invalid result
                type: { notIn: [TransactionFlowType.Withdrawal] },
                transactions: {
                  some: {
                    status: TransactionStatus.Approved,
                    createdAt: {
                      gte: dateStart,
                      lte: dateEnd,
                    },
                  },
                },
              },
            },
          },
          /* createdAt: {
            gte: dateStart,
            lte: dateEnd,
          }, */
        },
      }),
    ]);
    const surveyTotalEarningsAverage =
      surveyTotalEarnings._sum.agreedAmount.toNumber() / surveyInfluencersCount;
    //#endregion

    return {
      campaignTotalEarningsInfluencer,
      campaignTotalEarningsAverage,
      surveyTotalEarningsInfluencer,
      surveyTotalEarningsAverage,
    };

    // TODO delete
    const cpcInfluencer =
      await this.prismaService.campaignInfluencerPerformance.aggregate({
        _avg: { costPerTarget: true },
        where: {
          influencer: {
            userId,
          },
          campaign: projectId && {
            platformProductOrderId: projectId,
          },
          OR: [
            {
              createdAt: {
                gte: dateStart,
                lte: dateEnd,
              },
            },
            {
              // TODO review if preview is enabled while campaign is running
              campaign: {
                createdAt: {
                  gte: dateStart,
                  lte: dateEnd,
                },
              },
            },
          ],
        },
      });
    const cpcAverage =
      await this.prismaService.campaignInfluencerPerformance.aggregate({
        _avg: { costPerTarget: true },
        where: {
          campaign: projectId && {
            platformProductOrderId: projectId,
          },
          OR: [
            {
              createdAt: {
                gte: dateStart,
                lte: dateEnd,
              },
            },
            {
              // TODO review if preview is enabled while campaign is running
              campaign: {
                createdAt: {
                  gte: dateStart,
                  lte: dateEnd,
                },
              },
            },
          ],
        },
      });

    return {
      cpcInfluencer: cpcInfluencer._avg.costPerTarget,
      cpcAverage: cpcAverage._avg.costPerTarget,
    };
  }

  async totalEarnings30Days(userId: number, projectId?: number) {
    const dateStart = addDays(new Date(), -30);
    dateStart.setHours(0, 0, 0, 0);

    return await this.totalEarnings(userId, projectId, dateStart);
  }

  async desiredAmount(
    userId: number,
    socialPlatform: SocialPlatform,
    // * either postType or surveyType mustn't be undefined
    postType?: PostType,
    surveyType?: SurveyType,
    projectId?: number,
    dateStart?: Date,
    dateEnd?: Date,
  ) {
    // check if influencer exists
    const influencer = await this.influencersService.findOne(userId);

    if (postType !== undefined) {
      const campaignDesiredAmountInfluencer =
        await this.prismaService.influencerCampaignAmountChangelog.findFirst({
          where: {
            influencerCampaignAmount: {
              influencer: { userId },
              postType,
            },
            createdAt: {
              gte: dateStart,
              lte: dateEnd,
            },
          },
        });
      const campaignDesiredAmountAverage =
        await this.prismaService.influencerCampaignAmountChangelog.groupBy({
          by: ['influencerCampaignAmountId', 'createdAt'],
          _avg: { desiredAmount: true },
          _count: { id: true },
          where: {
            influencerCampaignAmount: {
              influencer: { userId },
              postType,
            },
            createdAt: {
              gte: dateStart,
              lte: dateEnd,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
    }

    const campaignDesiredAmountInfluencer =
      await this.prismaService.influencerCampaignAmount.findFirst({
        where: {
          influencer: { userId },
          postType,
        },
        select: {
          influencer: {
            select: {
              platformProductOrderInfluencers: {
                where: {
                  productOrderId: projectId,
                },
                select: {
                  productOrder: {
                    select: {
                      campaigns: {
                        where: {
                          postType,
                          createdAt: {
                            gte: dateStart,
                            lte: dateEnd,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    const surveyDesiredAmountsInfluencer =
      await this.prismaService.influencerSurveyAmount.findMany({
        where: {
          influencer: { userId },
          surveyType,
        },
      });

    const campaignDesiredAmountsAverage =
      await this.prismaService.influencerCampaignAmount.aggregate({
        _avg: { desiredAmount: true },
        where: {
          postType,
        },
      });
    const surveyDesiredAmountsAverage =
      await this.prismaService.influencerSurveyAmount.aggregate({
        _avg: { desiredAmount: true },
        where: {
          surveyType,
        },
      });
    await this.prismaService.influencerCampaignAmount.groupBy({
      by: ['postType'],
    });
    const reachInfluencer =
      await this.prismaService.campaignInfluencerPerformance.aggregate({
        _avg: { reach: true },
        where: {
          influencer: {
            userId,
          },
          campaign: projectId && {
            platformProductOrderId: projectId,
          },
          OR: [
            {
              createdAt: {
                gte: dateStart,
                lte: dateEnd,
              },
            },
            {
              // TODO review if preview is enabled while campaign is running
              campaign: {
                createdAt: {
                  gte: dateStart,
                  lte: dateEnd,
                },
              },
            },
          ],
        },
      });
    const reachAverage =
      await this.prismaService.campaignInfluencerPerformance.aggregate({
        _avg: { reach: true },
        where: {
          campaign: projectId && {
            platformProductOrderId: projectId,
          },
          OR: [
            {
              createdAt: {
                gte: dateStart,
                lte: dateEnd,
              },
            },
            {
              // TODO review if preview is enabled while campaign is running
              campaign: {
                createdAt: {
                  gte: dateStart,
                  lte: dateEnd,
                },
              },
            },
          ],
        },
      });

    return {
      reachInfluencer: reachInfluencer._avg.reach,
      reachAverage: reachAverage._avg.reach,
    };
  }
  //#endregion

  async comments(
    userId: number,
    projectId: number,
    dateStart?: Date,
    dateEnd?: Date,
  ) {
    // check if influencer exists
    const influencer = await this.influencersService.findOne(userId);

    const commentsCountInfluencer = await this.prismaService.userComment.count({
      where: {
        targetId: userId,
        createdAt: {
          gte: dateStart,
          lte: dateEnd,
        },
        user: projectId && {
          influencer: {
            platformProductOrderInfluencers: {
              some: {
                productOrderId: projectId,
              },
            },
          },
        },
      },
    });
    const commentsCountAverage = await this.prismaService.userComment.aggregate(
      {
        // number of messages and number of users with comments put on them
        _count: { id: true, targetId: true },
        where: {
          createdAt: {
            gte: dateStart,
            lte: dateEnd,
          },
          user: projectId && {
            influencer: {
              platformProductOrderInfluencers: {
                some: {
                  productOrderId: projectId,
                },
              },
            },
          },
        },
      },
    );

    return {
      commentsCountInfluencer: commentsCountInfluencer,
      commentsCountAverage:
        commentsCountAverage._count.id / commentsCountAverage._count.targetId,
    };
  }

  async websiteClicks(
    userId: number,
    projectId?: number,
    dateStart?: Date,
    dateEnd?: Date,
  ) {
    // check if influencer exists
    const influencer = await this.influencersService.findOne(userId);

    const websiteClicksInfluencer =
      await this.prismaService.campaignInfluencerPerformance.aggregate({
        _avg: { websiteClick: true },
        where: {
          influencer: {
            userId,
          },
          campaign: projectId && {
            platformProductOrderId: projectId,
          },
          OR: [
            {
              createdAt: {
                gte: dateStart,
                lte: dateEnd,
              },
            },
            {
              // TODO review if preview is enabled while campaign is running
              campaign: {
                createdAt: {
                  gte: dateStart,
                  lte: dateEnd,
                },
              },
            },
          ],
        },
      });
    const websiteClicksAverage =
      await this.prismaService.campaignInfluencerPerformance.aggregate({
        _avg: { websiteClick: true },
        where: {
          campaign: projectId && {
            platformProductOrderId: projectId,
          },
          OR: [
            {
              createdAt: {
                gte: dateStart,
                lte: dateEnd,
              },
            },
            {
              // TODO review if preview is enabled while campaign is running
              campaign: {
                createdAt: {
                  gte: dateStart,
                  lte: dateEnd,
                },
              },
            },
          ],
        },
      });

    return {
      websiteClicksInfluencer: websiteClicksInfluencer._avg.websiteClick,
      websiteClicksAverage: websiteClicksAverage._avg.websiteClick,
    };
  }

  async likes(
    userId: number,
    projectId?: number,
    dateStart?: Date,
    dateEnd?: Date,
  ) {
    // check if influencer exists
    const influencer = await this.influencersService.findOne(userId);

    const likesInfluencer =
      await this.prismaService.campaignInfluencerPerformance.aggregate({
        _avg: { likes: true },
        where: {
          influencer: {
            userId,
          },
          campaign: projectId && {
            platformProductOrderId: projectId,
          },
          OR: [
            {
              createdAt: {
                gte: dateStart,
                lte: dateEnd,
              },
            },
            {
              // TODO review if preview is enabled while campaign is running
              campaign: {
                createdAt: {
                  gte: dateStart,
                  lte: dateEnd,
                },
              },
            },
          ],
        },
      });
    const likesAverage =
      await this.prismaService.campaignInfluencerPerformance.aggregate({
        _avg: { likes: true },
        where: {
          campaign: projectId && {
            platformProductOrderId: projectId,
          },
          OR: [
            {
              createdAt: {
                gte: dateStart,
                lte: dateEnd,
              },
            },
            {
              // TODO review if preview is enabled while campaign is running
              campaign: {
                createdAt: {
                  gte: dateStart,
                  lte: dateEnd,
                },
              },
            },
          ],
        },
      });

    return {
      likesInfluencer: likesInfluencer._avg.likes,
      likesAverage: likesAverage._avg.likes,
    };
  }

  async costPerTarget(
    userId: number,
    projectId?: number,
    dateStart?: Date,
    dateEnd?: Date,
  ) {
    // check if influencer exists
    const influencer = await this.influencersService.findOne(userId);

    const cpcInfluencer =
      await this.prismaService.campaignInfluencerPerformance.aggregate({
        _avg: { costPerTarget: true },
        where: {
          influencer: {
            userId,
          },
          campaign: projectId && {
            platformProductOrderId: projectId,
          },
          OR: [
            {
              createdAt: {
                gte: dateStart,
                lte: dateEnd,
              },
            },
            {
              // TODO review if preview is enabled while campaign is running
              campaign: {
                createdAt: {
                  gte: dateStart,
                  lte: dateEnd,
                },
              },
            },
          ],
        },
      });
    const cpcAverage =
      await this.prismaService.campaignInfluencerPerformance.aggregate({
        _avg: { costPerTarget: true },
        where: {
          campaign: projectId && {
            platformProductOrderId: projectId,
          },
          OR: [
            {
              createdAt: {
                gte: dateStart,
                lte: dateEnd,
              },
            },
            {
              // TODO review if preview is enabled while campaign is running
              campaign: {
                createdAt: {
                  gte: dateStart,
                  lte: dateEnd,
                },
              },
            },
          ],
        },
      });

    return {
      cpcInfluencer: cpcInfluencer._avg.costPerTarget,
      cpcAverage: cpcAverage._avg.costPerTarget,
    };
  }

  async reach(
    userId: number,
    projectId?: number,
    dateStart?: Date,
    dateEnd?: Date,
  ) {
    // check if influencer exists
    const influencer = await this.influencersService.findOne(userId);

    const reachInfluencer =
      await this.prismaService.campaignInfluencerPerformance.aggregate({
        _avg: { reach: true },
        where: {
          influencer: {
            userId,
          },
          campaign: projectId && {
            platformProductOrderId: projectId,
          },
          OR: [
            {
              createdAt: {
                gte: dateStart,
                lte: dateEnd,
              },
            },
            {
              // TODO review if preview is enabled while campaign is running
              campaign: {
                createdAt: {
                  gte: dateStart,
                  lte: dateEnd,
                },
              },
            },
          ],
        },
      });
    const reachAverage =
      await this.prismaService.campaignInfluencerPerformance.aggregate({
        _avg: { reach: true },
        where: {
          campaign: projectId && {
            platformProductOrderId: projectId,
          },
          OR: [
            {
              createdAt: {
                gte: dateStart,
                lte: dateEnd,
              },
            },
            {
              // TODO review if preview is enabled while campaign is running
              campaign: {
                createdAt: {
                  gte: dateStart,
                  lte: dateEnd,
                },
              },
            },
          ],
        },
      });

    return {
      reachInfluencer: reachInfluencer._avg.reach,
      reachAverage: reachAverage._avg.reach,
    };
  }

  async surveyDesiredAmountDistribution(
    userId: number,
    surveyType: SurveyType,
  ) {
    const influencer = await this.prismaService.influencer.findUnique({
      where: { userId },
      include: {
        stakeholders: true,
        influencerSurveyAmounts: true,
      },
    });
    const influencerSurveyTypeSetting = influencer.influencerSurveyAmounts.find(
      (setting) => setting.surveyType === surveyType,
    );

    const surveyDesiredAmountDistribution =
      await this.prismaService.influencerSurveyDesiredAmountDistribution.findFirst(
        {
          where: {
            surveyType,
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            ranges: true,
          },
        },
      );

    const result = {
      metadata: new DesiredAmountResultMetadata({
        influencerSurveyTypeSetting: influencerSurveyTypeSetting,
        mean: surveyDesiredAmountDistribution.mean,
        standardDeviation: surveyDesiredAmountDistribution.standardDeviation,
      }),
      data: surveyDesiredAmountDistribution.ranges,
    };

    return result;
  }

  async campaignDesiredAmountDistribution(userId: number, postType: PostType) {
    const influencer = await this.prismaService.influencer.findUnique({
      where: { userId },
      include: {
        stakeholders: true,
        influencerCampaignAmounts: true,
      },
    });
    const influencerPostTypeSetting = influencer.influencerCampaignAmounts.find(
      (setting) => setting.postType === postType,
    );

    const campaignDesiredAmountDistribution =
      await this.prismaService.influencerCampaignDesiredAmountDistribution.findFirst(
        {
          where: {
            postType,
            influencerFollowersDistributionRange: {
              from: { lte: influencer.stakeholders[0]?.followersCount },
              to: { lt: influencer.stakeholders[0]?.followersCount },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            influencerFollowersDistributionRange: true,
            ranges: true,
          },
        },
      );

    const result = {
      metadata: new DesiredAmountResultMetadata({
        followersDistributionRange:
          campaignDesiredAmountDistribution.influencerFollowersDistributionRange,
        influencerPostTypeSetting: influencerPostTypeSetting,
        mean: campaignDesiredAmountDistribution.mean,
        standardDeviation: campaignDesiredAmountDistribution.standardDeviation,
      }),
      data: campaignDesiredAmountDistribution.ranges,
    };

    return result;

    /* const result: {
      metadata: {
        followersCount: number;
      },
      data: any[];
    }; */
  }
}
