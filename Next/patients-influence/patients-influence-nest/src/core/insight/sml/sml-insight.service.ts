import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { UserStatus } from 'src/utils';
import { getNPeriods, getPeriods } from '../utils/period-generator';
import { GraphParamsDto, NPointGraphParamsDto } from '../dto/graph-params.dto';
import { SMLFilterParamsDto } from './dto/filter-params.dto';
import { Prisma } from '@prisma/client';
import { IGraphDataPoint } from '../interfaces/graph-data-point.interface';
import { IGraphResult } from '../interfaces/graph-result.interface';
import { graphQueryWhere } from '../utils/query-where';
import { PlatformProduct } from 'src/core/platform-product/enums/platform-product.enum';
import { Status } from 'src/core/campaign/enums/status.enum';
import { SmlPostsFilterDto } from 'src/core/sml/dto';
import { TokenType } from 'src/core/sml/enums/token-type.type';
import { StakeholderType } from 'src/utils/enums/stakeholder-type.enum';
import { GraphType } from '../enums/graph-type.enum';
import { SMLService } from 'src/core/sml/sml.service';
import { ForbiddenApplicationException } from 'src/exceptions/application.exception';
import { calculateDOB } from 'src/core/sml/utils/date-of-birth';
import { PaginationParamsDto } from 'src/utils/object-definitions/dtos/pagination-params.dto';
import { SMLMostMentionedWordsParamsDto } from './dto/most-mentioned-words-params.dto';
import { SMLGraphParamsDto } from './dto/sml-graph-params.dto';
import { SMLMostMentionedBrandsParamsDto } from './dto/most-mentioned-brands-params.dto';
import { SMLMostMentionedProductsParamsDto } from './dto/most-mentioned-products-params.dto';
import { SMLMostMentionedSymptomsParamsDto } from './dto/most-mentioned-symptoms-params.dto';
import { SMLMostMentionedStrugglesParamsDto } from './dto/most-mentioned-struggles-params.dto';
import { SMLMostUsedWordsWithBrandsParamsDto } from './dto/most-used-words-with-brands-params.dto';
import { SMLMostUsedWordsWithProductsParamsDto } from './dto/most-used-words-with-products-params.dto';
import { SMLMostUsedWordsWithSymptomsParamsDto } from './dto/most-used-words-with-symtoms-params.dto';
import { SMLMostUsedWordsWithStrugglesParamsDto } from './dto/most-used-words-with-struggles-params.dto';
import { GraphPeriod } from '../enums/graph-period.enum';
import { GraphIncludeData } from '../enums/graph-include-data.enum';
import { getChange } from '../utils/relative-change';

@Injectable()
export class SMLInsightService {
  private readonly logger = new Logger(SMLInsightService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly smlService: SMLService,
  ) {}

  private async getSMLCountDataDataIncluded(
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
          await this.prismaService.socialMediaListening.count({
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

          const lastData = await this.prismaService.socialMediaListening.count({
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
            await this.prismaService.socialMediaListening.count({
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

  async getSMLCountData(
    {
      graphPeriod,
      graphType,
      maxResults,
      roundDateToDay,
      roundDateToMonth,
      includeOngoingPeriod,
      includePeriodBorders,
      includeData,
    }: GraphParamsDto,
    { status }: SMLFilterParamsDto,
  ) {
    const queryWhere: Prisma.SocialMediaListeningWhereInput = {
      platformProductOrder: { status },
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

    const dataIncluded = await this.getSMLCountDataDataIncluded(
      {
        graphPeriod,
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

    const result: IGraphResult = { data: [], dataLength: -1, ...dataIncluded };

    for (const { dateFrom, dateTo } of periods) {
      const queryResult = await this.prismaService.socialMediaListening.count({
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

    result.dataLength = result.data.length;

    return result;
  }

  private async getSMLRevenueDataDataIncluded(
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
          return getChange(
            lastData._sum.budget.toNumber(),
            preLastData._sum.budget.toNumber(),
          );
        })();
      }
    }

    return dataIncluded;
  }

  async getSMLRevenueData({
    graphPeriod,
    graphType,
    maxResults,
    roundDateToDay,
    roundDateToMonth,
    includeOngoingPeriod,
    includePeriodBorders,
  }: GraphParamsDto) {
    const queryWhere: Prisma.PlatformProductOrderWhereInput = {
      status: Status.Finished,
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

    const dataIncluded = await this.getSMLRevenueDataDataIncluded(
      {
        graphPeriod,
        graphType,
        maxResults,
        roundDateToDay,
        roundDateToMonth,
        includeOngoingPeriod,
        includePeriodBorders,
      },
      queryWhere,
    );

    const result: IGraphResult = { data: [], dataLength: -1, ...dataIncluded };

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

    result.dataLength = result.data.length;

    return result;
  }

  private smlAuthorFilterQuery(
    filters: SmlPostsFilterDto,
  ): Prisma.StakeholderWhereInput {
    const { minDOB, maxDOB } = calculateDOB(
      filters.authorFilter?.ageMin,
      filters.authorFilter?.ageMax,
    );

    const query = {
      type: { in: filters.authorFilter?.stakeholders },
      // * patients and caregivers have disease areas ONLY
      patientCaregiverDiseaseAreas: filters.authorFilter?.diseaseAreas && {
        some: {
          diseaseAreaId: { in: filters.authorFilter?.diseaseAreas },
        },
      },
      locationId: { in: filters.authorFilter?.locations },
      ethnicityId: { in: filters.authorFilter?.ethnicities },
      influencer: filters.authorFilter?.genders && {
        // influencer-defined gender and DoB before stakeholder-discovered gender and DoB
        OR: [
          {
            gender: { in: filters.authorFilter?.genders },
            // TODO uncomment
            /* dateOfBirth: {
                      gte: maxDOB,
                      lte: minDOB,
                    }, */
          },
          {
            stakeholders: filters.authorFilter?.genders && {
              some: {
                gender: { in: filters.authorFilter?.genders },
                // TODO uncomment
                /* dateOfBirth: {
                          gte: maxDOB,
                          lte: minDOB,
                        }, */
              },
              // TODO author struggles
              // TODO author symtoms
              stakeholderInterests: filters.authorFilter?.interests && {
                some: {
                  interestId: { in: filters.authorFilter?.interests },
                },
              },
              bio: { contains: filters.authorFilter?.bio, mode: 'insensitive' },

              //#region POST
              socialPlatformId: { in: filters.postFilter?.socialMedias },
              //#endregion
            },
            //#endregion

            //#region POST
            postThemes: filters.postFilter?.themes && {
              some: { themeId: { in: filters.postFilter?.themes } },
            },
            postDiseaseAreas: filters.postFilter?.diseaseAreas && {
              some: { diseaseAreaId: { in: filters.postFilter?.diseaseAreas } },
            },
            postStruggles: filters.postFilter?.struggles && {
              some: { struggleId: { in: filters.postFilter?.struggles } },
            },
            postSymptom: filters.postFilter?.symptoms && {
              some: { symptomId: { in: filters.postFilter?.symptoms } },
            },
            postInterests: filters.postFilter?.interests && {
              some: { interestId: { in: filters.postFilter?.interests } },
            },
            overallSentiment: {
              in: filters.postFilter?.sentiments,
            },
            language: {
              in: filters.postFilter?.languages,
            },
          },
        ],
      },
      // * author struggles and symptoms (discovered from author's posts; retrieve all his posts)
      stakeholderPosts: (filters.authorFilter?.struggles ||
        filters.authorFilter?.symptoms) && {
        some: {
          postStruggles: filters.authorFilter?.struggles && {
            some: {
              struggleId: { in: filters.authorFilter.struggles },
            },
          },
          postSymptom: filters.authorFilter?.symptoms && {
            some: {
              symptomId: { in: filters.authorFilter.symptoms },
            },
          },
        },
      },
      stakeholderInterests: filters.authorFilter?.interests && {
        some: {
          interestId: { in: filters.authorFilter?.interests },
        },
      },
      // TODO any of the words divided by space, eg. "headache strong" (headache AND strong)
      // bio: { contains: filters.authorFilter?.bio, mode: 'insensitive' },
      /* AND: filters.authorFilter.bio.split(' ').map((searchWord) => ({
                bio: { contains: ` ${searchWord} `, mode: 'insensitive' },
              })), */
      AND:
        filters.authorFilter?.bio &&
        filters.authorFilter.bio
          .trim()
          .split(/s+/)
          .map((searchAND) => ({
            OR: searchAND
              .split('/')
              .map((searchWord) => {
                const result = [];

                for (const char of ` !,.?`.split('')) {
                  result.push({
                    bio: {
                      contains: ` ${searchWord}${char}`,
                      mode: 'insensitive',
                    },
                  });
                  result.push({
                    bio: {
                      startsWith: `${searchWord}${char}`,
                      mode: 'insensitive',
                    },
                  });
                }

                return result;
                /* {
                      bio: { contains: ` ${searchWord} `, mode: 'insensitive' },
                      } */
              })
              .flat(),
          })),
      /* AND: filters.authorFilter.bio.split(' ').map((searchWord) => ({
                bio: { contains: ` ${searchWord} `, mode: 'insensitive' },
              })), */

      //#region POST
      socialPlatformId: { in: filters.postFilter?.socialMedias },
      //#endregion
    };

    return query;
  }

  private smlPostFilterQuery(
    filters: SmlPostsFilterDto,
  ): Prisma.StakeholderPostWhereInput {
    const query = {
      //#region POST
      postTheme: { in: filters.postFilter?.themes },
      postDiseaseAreas: filters.postFilter?.diseaseAreas && {
        some: { diseaseAreaId: { in: filters.postFilter?.diseaseAreas } },
      },
      postStruggles: filters.postFilter?.struggles && {
        some: { struggleId: { in: filters.postFilter?.struggles } },
      },
      postSymptom: filters.postFilter?.symptoms && {
        some: { symptomId: { in: filters.postFilter?.symptoms } },
      },
      postInterest: {
        in: filters.postFilter?.interests,
      },
      overallSentiment: {
        in: filters.postFilter?.sentiments,
      },
      language: {
        in: filters.postFilter?.languages,
      },
      likes: {
        gte: filters.postFilter?.likesMin,
        lte: filters.postFilter?.likesMax,
      },
      comments: {
        gte: filters.postFilter?.commentsMin,
        lte: filters.postFilter?.commentsMax,
      },
      createdAt: {
        gte: filters.postFilter?.dateFrom,
        lte: filters.postFilter?.dateTo,
      },
      // TODO keyword in content
      // content: ...
      //#endregion
    };

    return query;
  }

  private async verifyFilters(id: number, filters: SmlPostsFilterDto) {
    const smlOrder = await this.smlService.findOneById(id);

    // TODO add more restrictions
    if (
      filters.postFilter.socialMedias.every((socialMedia) =>
        smlOrder.SMLPlatforms.find(
          (smlSocialMedia) => smlSocialMedia.socialPlatformId === socialMedia,
        ),
      )
    ) {
      throw new ForbiddenApplicationException(
        `Not allowed to use some filters: buy more filters`,
      );
    }
  }

  normalizeGroupData(
    groupData: IGraphResult[],
    periods: { dateFrom: Date; dateTo: Date }[],
    includePeriodBorders: boolean,
  ) {
    for (const group of groupData) {
      for (const { dateFrom, dateTo } of periods) {
        if (group.data.every((data) => data.timestamp !== dateFrom)) {
          const dataPoint: IGraphDataPoint = {
            value: 0,
            timestamp: dateFrom,
            dateFrom,
            dateTo,
          };

          if (includePeriodBorders) group.data.push(dataPoint);
          else {
            const { value, timestamp, ...periodBorders } = dataPoint;
            group.data.push({ value, timestamp });
          }
        }
      }

      group.data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }
  }

  //#region MOST MENTIONED X
  async mostMentionedWords(
    id: number,
    {
      skip,
      take,
      graphType,
      includePeriodBorders,
      numberOfPoints,
    }: SMLGraphParamsDto,
    filters: SMLMostMentionedWordsParamsDto,
  ) {
    // TODO await this.verifyFilters(id, filters);

    // find top N words
    const words = await this.prismaService.postContentTokenOccurence.groupBy({
      by: ['tokenId'],
      _sum: { occurences: true },
      where: {
        post: {
          ...this.smlPostFilterQuery(filters),
          stakeholder: this.smlAuthorFilterQuery(filters),
        },
        token: {
          tokenType: filters.tokenType,
        },
      },
      orderBy: {
        _sum: {
          occurences: 'desc',
        },
      },
      skip: skip,
      take: take, //  overviewFilters.maxWords,
    });
    const [oldestAndNewestWordOccurences, wordsWithProperties] =
      await Promise.all([
        // find oldest and newest post that mention any of the given words (tokens)
        this.prismaService.stakeholderPost.aggregate({
          _min: { createdAt: true },
          _max: { createdAt: true },
          where: {
            tokenOccurences: {
              some: {
                tokenId: { in: words.map((word) => word.tokenId) },
              },
            },
          },
        }),
        // retrieve tokens for token names
        this.prismaService.postContentToken.findMany({
          where: { id: { in: words.map((word) => word.tokenId) } },
          select: { id: true, token: true },
        }),
      ]);
    const periods = getNPeriods(
      filters.postFilter?.dateFrom,
      filters.postFilter?.dateTo,
      oldestAndNewestWordOccurences._min.createdAt,
      oldestAndNewestWordOccurences._max.createdAt,
      numberOfPoints,
    );
    const result: IGraphResult[] = [];

    for (const { dateFrom, dateTo } of periods) {
      const queryResult =
        await this.prismaService.postContentTokenOccurence.groupBy({
          by: ['tokenId'],
          _sum: { occurences: true },
          where: {
            post: graphQueryWhere(graphType, dateFrom, dateTo),
            tokenId: { in: words.map((word) => word.tokenId) },
          },
        });

      for (const group of queryResult) {
        const graphResult: IGraphResult = { data: [] };
        const dataPoint: IGraphDataPoint = {
          value: group._sum?.occurences || 0,
          timestamp: dateFrom,
          dateFrom,
          dateTo,
        };

        if (includePeriodBorders) graphResult.data.push(dataPoint);
        else {
          const { value, timestamp, ...periodBorders } = dataPoint;
          graphResult.data.push({ value, timestamp });
        }

        const existingToken = result.find((r) => r.tokenId === group.tokenId);

        if (existingToken) {
          existingToken.data.push(...graphResult.data);
          continue;
        }

        result.push({
          tokenId: group.tokenId,
          token: wordsWithProperties.find((word) => word.id === group.tokenId)
            ?.token,
          ...graphResult,
        });
      }
    }

    this.normalizeGroupData(result, periods, includePeriodBorders);

    return result;
  }

  async mostMentionedBrands(
    id: number,
    {
      skip,
      take,
      graphType,
      includePeriodBorders,
      numberOfPoints,
    }: SMLGraphParamsDto,
    filters: SMLMostMentionedBrandsParamsDto,
  ) {
    // TODO await this.verifyFilters(id, filters);

    // find top N brands
    const brands = await this.prismaService.postBrand.groupBy({
      by: ['brandId'],
      _count: { stakeholderPostId: true },
      where: {
        stakeholderPost: {
          ...this.smlPostFilterQuery(filters),
          stakeholder: this.smlAuthorFilterQuery(filters),
        },
      },
      orderBy: {
        _count: {
          stakeholderPostId: 'desc',
        },
      },
      skip: skip,
      take: take,
    });
    const [oldestAndNewestBrandOccurences, brandsWithProperties] =
      await Promise.all([
        // find oldest and newest post that mention any of the given brands
        this.prismaService.stakeholderPost.aggregate({
          _min: { createdAt: true },
          _max: { createdAt: true },
          where: {
            postBrands: {
              some: {
                brandId: { in: brands.map((brand) => brand.brandId) },
              },
            },
          },
        }),
        // retrieve brands for brand names
        this.prismaService.postBrand.findMany({
          where: { id: { in: brands.map((brand) => brand.brandId) } },
          select: { id: true, company: true },
        }),
      ]);
    const periods = getNPeriods(
      filters.postFilter?.dateFrom,
      filters.postFilter?.dateTo,
      oldestAndNewestBrandOccurences._min.createdAt,
      oldestAndNewestBrandOccurences._max.createdAt,
      numberOfPoints,
    );
    const result: IGraphResult[] = [];

    for (const { dateFrom, dateTo } of periods) {
      const queryResult = await this.prismaService.postBrand.groupBy({
        by: ['brandId'],
        _count: { stakeholderPostId: true },
        where: {
          stakeholderPost: graphQueryWhere(graphType, dateFrom, dateTo),
          brandId: { in: brands.map((brand) => brand.brandId) },
        },
      });

      for (const group of queryResult) {
        const graphResult: IGraphResult = { data: [] };
        const dataPoint: IGraphDataPoint = {
          value: group._count?.stakeholderPostId || 0,
          timestamp: dateFrom,
          dateFrom,
          dateTo,
        };

        if (includePeriodBorders) graphResult.data.push(dataPoint);
        else {
          const { value, timestamp, ...periodBorders } = dataPoint;
          graphResult.data.push({ value, timestamp });
        }

        const existingBrand = result.find((r) => r.brandId === group.brandId);

        if (existingBrand) {
          existingBrand.data.push(...graphResult.data);
          continue;
        }

        result.push({
          brandId: group.brandId,
          brand: brandsWithProperties.find(
            (brand) => brand.id === group.brandId,
          )?.company.name,
          ...graphResult,
        });
      }
    }

    this.normalizeGroupData(result, periods, includePeriodBorders);

    return result;
  }

  async mostMentionedProducts(
    id: number,
    {
      skip,
      take,
      graphType,
      includePeriodBorders,
      numberOfPoints,
    }: SMLGraphParamsDto,
    filters: SMLMostMentionedProductsParamsDto,
  ) {
    // TODO await this.verifyFilters(id, filters);

    // find top N products
    const products = await this.prismaService.postProduct.groupBy({
      by: ['productId'],
      _count: { stakeholderPostId: true },
      where: {
        stakeholderPost: {
          ...this.smlPostFilterQuery(filters),
          stakeholder: this.smlAuthorFilterQuery(filters),
        },
      },
      orderBy: {
        _count: {
          stakeholderPostId: 'desc',
        },
      },
      skip: skip,
      take: take,
    });
    const [oldestAndNewestProductOccurences, productsWithProperties] =
      await Promise.all([
        // find oldest and newest post that mention any of the given products
        this.prismaService.stakeholderPost.aggregate({
          _min: { createdAt: true },
          _max: { createdAt: true },
          where: {
            postProducts: {
              some: {
                productId: { in: products.map((product) => product.productId) },
              },
            },
          },
        }),
        // retrieve products for product names
        this.prismaService.postProduct.findMany({
          where: { id: { in: products.map((product) => product.productId) } },
          select: { id: true, product: true },
        }),
      ]);
    const periods = getNPeriods(
      filters.postFilter?.dateFrom,
      filters.postFilter?.dateTo,
      oldestAndNewestProductOccurences._min.createdAt,
      oldestAndNewestProductOccurences._max.createdAt,
      numberOfPoints,
    );
    const result: IGraphResult[] = [];

    for (const { dateFrom, dateTo } of periods) {
      const queryResult = await this.prismaService.postProduct.groupBy({
        by: ['productId'],
        _count: { stakeholderPostId: true },
        where: {
          stakeholderPost: graphQueryWhere(graphType, dateFrom, dateTo),
          productId: { in: products.map((product) => product.productId) },
        },
      });

      for (const group of queryResult) {
        const graphResult: IGraphResult = { data: [] };
        const dataPoint: IGraphDataPoint = {
          value: group._count?.stakeholderPostId || 0,
          timestamp: dateFrom,
          dateFrom,
          dateTo,
        };

        if (includePeriodBorders) graphResult.data.push(dataPoint);
        else {
          const { value, timestamp, ...periodBorders } = dataPoint;
          graphResult.data.push({ value, timestamp });
        }

        const existingProduct = result.find(
          (r) => r.productId === group.productId,
        );

        if (existingProduct) {
          existingProduct.data.push(...graphResult.data);
          continue;
        }

        result.push({
          productId: group.productId,
          product: productsWithProperties.find(
            (product) => product.id === group.productId,
          )?.product.name,
          ...graphResult,
        });
      }
    }

    this.normalizeGroupData(result, periods, includePeriodBorders);

    return result;
  }

  async mostMentionedSymptoms(
    id: number,
    {
      skip,
      take,
      graphType,
      includePeriodBorders,
      numberOfPoints,
    }: SMLGraphParamsDto,
    filters: SMLMostMentionedSymptomsParamsDto,
  ) {
    // TODO await this.verifyFilters(id, filters);

    // find top N symptoms
    const symptoms = await this.prismaService.postSymptom.groupBy({
      by: ['symptomId'],
      _count: { stakeholderPostId: true },
      where: {
        stakeholderPost: {
          ...this.smlPostFilterQuery(filters),
          stakeholder: this.smlAuthorFilterQuery(filters),
        },
      },
      orderBy: {
        _count: {
          stakeholderPostId: 'desc',
        },
      },
      skip: skip,
      take: take,
    });
    const [oldestAndNewestSymptomOccurences, symptomsWithProperties] =
      await Promise.all([
        // find oldest and newest post that mention any of the given symptoms
        this.prismaService.stakeholderPost.aggregate({
          _min: { createdAt: true },
          _max: { createdAt: true },
          where: {
            postSymptom: {
              some: {
                symptomId: { in: symptoms.map((symptom) => symptom.symptomId) },
              },
            },
          },
        }),
        // retrieve symptoms for symptom names
        this.prismaService.postSymptom.findMany({
          where: { id: { in: symptoms.map((symptom) => symptom.symptomId) } },
          select: { id: true, symptom: true },
        }),
      ]);
    const periods = getNPeriods(
      filters.postFilter?.dateFrom,
      filters.postFilter?.dateTo,
      oldestAndNewestSymptomOccurences._min.createdAt,
      oldestAndNewestSymptomOccurences._max.createdAt,
      numberOfPoints,
    );
    const result: IGraphResult[] = [];

    for (const { dateFrom, dateTo } of periods) {
      const queryResult = await this.prismaService.postSymptom.groupBy({
        by: ['symptomId'],
        _count: { stakeholderPostId: true },
        where: {
          stakeholderPost: graphQueryWhere(graphType, dateFrom, dateTo),
          symptomId: { in: symptoms.map((symptom) => symptom.symptomId) },
        },
      });

      for (const group of queryResult) {
        const graphResult: IGraphResult = { data: [] };
        const dataPoint: IGraphDataPoint = {
          value: group._count?.stakeholderPostId || 0,
          timestamp: dateFrom,
          dateFrom,
          dateTo,
        };

        if (includePeriodBorders) graphResult.data.push(dataPoint);
        else {
          const { value, timestamp, ...periodBorders } = dataPoint;
          graphResult.data.push({ value, timestamp });
        }

        const existingSymptom = result.find(
          (r) => r.symptomId === group.symptomId,
        );

        if (existingSymptom) {
          existingSymptom.data.push(...graphResult.data);
          continue;
        }

        result.push({
          symptomId: group.symptomId,
          symptom: symptomsWithProperties.find(
            (product) => product.id === group.symptomId,
          )?.symptom.name,
          ...graphResult,
        });
      }
    }

    this.normalizeGroupData(result, periods, includePeriodBorders);

    return result;
  }

  async mostMentionedStruggles(
    id: number,
    {
      skip,
      take,
      graphType,
      includePeriodBorders,
      numberOfPoints,
    }: SMLGraphParamsDto,
    filters: SMLMostMentionedStrugglesParamsDto,
  ) {
    // TODO await this.verifyFilters(id, filters);

    // find top N struggles
    const struggles = await this.prismaService.postStruggle.groupBy({
      by: ['struggleId'],
      _count: { stakeholderPostId: true },
      where: {
        stakeholderPost: {
          ...this.smlPostFilterQuery(filters),
          stakeholder: this.smlAuthorFilterQuery(filters),
        },
      },
      orderBy: {
        _count: {
          stakeholderPostId: 'desc',
        },
      },
      skip: skip,
      take: take,
    });
    const [oldestAndNewestStruggleOccurences, strugglesWithProperties] =
      await Promise.all([
        // find oldest and newest post that mention any of the given struggles
        this.prismaService.stakeholderPost.aggregate({
          _min: { createdAt: true },
          _max: { createdAt: true },
          where: {
            postStruggles: {
              some: {
                struggleId: {
                  in: struggles.map((struggle) => struggle.struggleId),
                },
              },
            },
          },
        }),
        // retrieve struggles for struggle names
        this.prismaService.postStruggle.findMany({
          where: {
            id: { in: struggles.map((struggle) => struggle.struggleId) },
          },
          select: { id: true, struggle: true },
        }),
      ]);
    const periods = getNPeriods(
      filters.postFilter?.dateFrom,
      filters.postFilter?.dateTo,
      oldestAndNewestStruggleOccurences._min.createdAt,
      oldestAndNewestStruggleOccurences._max.createdAt,
      numberOfPoints,
    );
    const result: IGraphResult[] = [];

    for (const { dateFrom, dateTo } of periods) {
      const queryResult = await this.prismaService.postStruggle.groupBy({
        by: ['struggleId'],
        _count: { stakeholderPostId: true },
        where: {
          stakeholderPost: graphQueryWhere(graphType, dateFrom, dateTo),
          struggleId: {
            in: struggles.map((struggle) => struggle.struggleId),
          },
        },
      });

      for (const group of queryResult) {
        const graphResult: IGraphResult = { data: [] };
        const dataPoint: IGraphDataPoint = {
          value: group._count?.stakeholderPostId || 0,
          timestamp: dateFrom,
          dateFrom,
          dateTo,
        };

        if (includePeriodBorders) graphResult.data.push(dataPoint);
        else {
          const { value, timestamp, ...periodBorders } = dataPoint;
          graphResult.data.push({ value, timestamp });
        }

        const existingStruggle = result.find(
          (r) => r.struggleId === group.struggleId,
        );

        if (existingStruggle) {
          existingStruggle.data.push(...graphResult.data);
          continue;
        }

        result.push({
          struggleId: group.struggleId,
          struggle: strugglesWithProperties.find(
            (struggle) => struggle.id === group.struggleId,
          )?.struggle.name,
          ...graphResult,
        });
      }
    }

    this.normalizeGroupData(result, periods, includePeriodBorders);

    return result;
  }
  //#endregion

  //#region MOST USED X WITH Y
  async mostUsedWordsWithBrands(
    id: number,
    {
      skip, // ! ignored
      take,
      graphType, // ! ignored
      includePeriodBorders, // ! ignored
      numberOfPoints, // ! ignored
    }: SMLGraphParamsDto,
    filters: SMLMostUsedWordsWithBrandsParamsDto,
  ) {
    // TODO await this.verifyFilters(id, filters);

    // find top N words
    const words = await this.prismaService.postContentTokenOccurence.groupBy({
      by: ['tokenId'],
      _sum: { occurences: true },
      where: {
        post: {
          ...this.smlPostFilterQuery(filters),
          stakeholder: this.smlAuthorFilterQuery(filters),
          postBrands: {
            some: {
              brandId: { in: filters.brandIds.map((brandId) => brandId) },
            },
          },
        },
        token: {
          tokenType: filters.tokenType,
        },
      },
      orderBy: {
        _sum: {
          occurences: 'desc',
        },
      },
      skip: 0,
      take: take,
    });
    // retrieve tokens for token names
    const wordsWithProperties =
      await this.prismaService.postContentToken.findMany({
        where: { id: { in: words.map((word) => word.tokenId) } },
        select: { id: true, token: true },
      });
    const result = words.map((word) => ({
      wordId: word.tokenId,
      word: wordsWithProperties.find(
        (wordsWithProperty) => wordsWithProperty.id === word.tokenId,
      )?.token,
      occurences: word._sum.occurences,
    }));

    return result;
  }

  async mostUsedWordsWithProducts(
    id: number,
    {
      skip, // ! ignored
      take,
      graphType, // ! ignored
      includePeriodBorders, // ! ignored
      numberOfPoints, // ! ignored
    }: SMLGraphParamsDto,
    filters: SMLMostUsedWordsWithProductsParamsDto,
  ) {
    // TODO await this.verifyFilters(id, filters);

    // find top N words
    const words = await this.prismaService.postContentTokenOccurence.groupBy({
      by: ['tokenId'],
      _sum: { occurences: true },
      where: {
        post: {
          ...this.smlPostFilterQuery(filters),
          stakeholder: this.smlAuthorFilterQuery(filters),
          postProducts: {
            some: {
              productId: {
                in: filters.productIds.map((productId) => productId),
              },
            },
          },
        },
        token: {
          tokenType: filters.tokenType,
        },
      },
      orderBy: {
        _sum: {
          occurences: 'desc',
        },
      },
      skip: 0,
      take: take,
    });
    // retrieve tokens for token names
    const wordsWithProperties =
      await this.prismaService.postContentToken.findMany({
        where: { id: { in: words.map((word) => word.tokenId) } },
        select: { id: true, token: true },
      });
    const result = words.map((word) => ({
      wordId: word.tokenId,
      word: wordsWithProperties.find(
        (wordsWithProperty) => wordsWithProperty.id === word.tokenId,
      )?.token,
      occurences: word._sum.occurences,
    }));

    return result;
  }

  async mostUsedWordsWithSymtoms(
    id: number,
    {
      skip, // ! ignored
      take,
      graphType, // ! ignored
      includePeriodBorders, // ! ignored
      numberOfPoints, // ! ignored
    }: SMLGraphParamsDto,
    filters: SMLMostUsedWordsWithSymptomsParamsDto,
  ) {
    // TODO await this.verifyFilters(id, filters);

    // find top N words
    const words = await this.prismaService.postContentTokenOccurence.groupBy({
      by: ['tokenId'],
      _sum: { occurences: true },
      where: {
        post: {
          ...this.smlPostFilterQuery(filters),
          stakeholder: this.smlAuthorFilterQuery(filters),
          postSymptom: {
            some: {
              symptomId: {
                in: filters.symtomIds.map((symptomId) => symptomId),
              },
            },
          },
        },
        token: {
          tokenType: filters.tokenType,
        },
      },
      orderBy: {
        _sum: {
          occurences: 'desc',
        },
      },
      skip: 0,
      take: take,
    });
    // retrieve tokens for token names
    const wordsWithProperties =
      await this.prismaService.postContentToken.findMany({
        where: { id: { in: words.map((word) => word.tokenId) } },
        select: { id: true, token: true },
      });
    const result = words.map((word) => ({
      wordId: word.tokenId,
      word: wordsWithProperties.find(
        (wordsWithProperty) => wordsWithProperty.id === word.tokenId,
      )?.token,
      occurences: word._sum.occurences,
    }));

    return result;
  }

  async mostUsedWordsWithStruggles(
    id: number,
    {
      skip, // ! ignored
      take,
      graphType, // ! ignored
      includePeriodBorders, // ! ignored
      numberOfPoints, // ! ignored
    }: SMLGraphParamsDto,
    filters: SMLMostUsedWordsWithStrugglesParamsDto,
  ) {
    // TODO await this.verifyFilters(id, filters);

    // find top N words
    const words = await this.prismaService.postContentTokenOccurence.groupBy({
      by: ['tokenId'],
      _sum: { occurences: true },
      where: {
        post: {
          ...this.smlPostFilterQuery(filters),
          stakeholder: this.smlAuthorFilterQuery(filters),
          postStruggles: {
            some: {
              struggleId: {
                in: filters.struggleIds.map((struggleId) => struggleId),
              },
            },
          },
        },
        token: {
          tokenType: filters.tokenType,
        },
      },
      orderBy: {
        _sum: {
          occurences: 'desc',
        },
      },
      skip: 0,
      take: take,
    });
    // retrieve tokens for token names
    const wordsWithProperties =
      await this.prismaService.postContentToken.findMany({
        where: { id: { in: words.map((word) => word.tokenId) } },
        select: { id: true, token: true },
      });
    const result = words.map((word) => ({
      wordId: word.tokenId,
      word: wordsWithProperties.find(
        (wordsWithProperty) => wordsWithProperty.id === word.tokenId,
      )?.token,
      occurences: word._sum.occurences,
    }));

    return result;
  }
  //#endregion

  //#region BASIC GRAPHS (bar chart only)
  /* async interests(
    id: number,
    {
      skip,
      take,
      graphType, // ! ignored
      includePeriodBorders, // ! ignored
      numberOfPoints, // ! ignored
    }: SMLGraphParamsDto,
    filters: SmlPostsFilterDto,
  ) {
    // TODO await this.verifyFilters(id, filters);

    // find top N interests
    const interests = await this.prismaService.stakeholderInterest.groupBy({
      by: ['interestId'],
      _count: { stakeholderId: true },
      where: {
        stakeholder: {
          stakeholderPosts: {
            some: {
              ...this.smlPostFilterQuery(filters),
              stakeholder: this.smlAuthorFilterQuery(filters),
            },
          },
        },
      },
      orderBy: {
        _count: {
          stakeholderId: 'desc',
        },
      },
      skip: skip,
      take: take,
    });

    const locations =
      await this.prismaService.platformProductOrderLocation.groupBy({
        by: ['locationId'],
        _count: { productOrderId: true },
        where: {
          productOrder: {
            platformProductOrderInfluencers: {
              some: {
                influencer: {
                  stakeholders: {
                    some: {
                      stakeholderPosts: {
                        some: {
                          ...this.smlPostFilterQuery(filters),
                          stakeholder: this.smlAuthorFilterQuery(filters),
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          _count: {
            productOrderId: 'desc',
          },
        },
        skip: skip,
        take: take,
      });
    const words = await this.prismaService.postContentTokenOccurence.groupBy({
      by: ['tokenId'],
      _sum: { occurences: true },
      where: {
        post: {
          ...this.smlPostFilterQuery(filters),
          stakeholder: this.smlAuthorFilterQuery(filters),
          postBrands: {
            some: {
              brandId: { in: filters.brandIds.map((brandId) => brandId) },
            },
          },
        },
        token: {
          tokenType: filters.tokenType,
        },
      },
      orderBy: {
        _sum: {
          occurences: 'desc',
        },
      },
      skip: 0,
      take: take,
    });
    // retrieve tokens for token names
    const wordsWithProperties =
      await this.prismaService.postContentToken.findMany({
        where: { id: { in: words.map((word) => word.tokenId) } },
        select: { id: true, token: true },
      });
    const result = words.map((word) => ({
      wordId: word.tokenId,
      word: wordsWithProperties.find(
        (wordsWithProperty) => wordsWithProperty.id === word.tokenId,
      )?.token,
      occurences: word._sum.occurences,
    }));

    return result;
  } */
  //#endregion
}
