import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { CreatePlatformProductOrderDto } from './dto';
import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import {
  PlatformProductOrder,
  PlatformProductOrderInfluencer,
  Prisma,
} from '@prisma/client';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { FilterParamsDto } from '../../utils/object-definitions/dtos/filter-params.dto';
import { ambassadorCommission } from 'src/config';
import { UpdatePlatformProductOrderDto } from './dto/update-platform-product-order.dto';
import { AddInfluencersDto } from './dto/add-influencers.dto';
import { ClientService } from '../client/client.service';
import { FinanceStatus } from '../campaign/enums/finance-status.enum';
import { ReceivePendingRevenuesDto } from './dto/receive-pending-revenues.dto';
import { ProductOrderInfluencerStatus } from './enums/product-order-influencer-status.enum';
import { ApprovePaymentsDto } from './dto/approve-payments.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from 'src/utils';
import { FindByIdsDto } from '../finance/dto/find-by-ids.dto';
import { RevenueFilterDto } from './dto/revenue-filter.dto';

@Injectable()
export class PlatformProductOrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clientService: ClientService,
  ) {}

  static queryInclude: Prisma.PlatformProductOrderInclude = {
    client: {
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        ambassador: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    },
    // platformProduct: true,
    platformProductOrderLocations: { include: { location: true } },
    platformProductOrderDiseaseAreas: { include: { diseaseArea: true } },
    platformProductOrderInterests: { include: { interest: true } },
    platformProductOrderEthnicities: { include: { ethnicity: true } },
    platformProductOrderStruggles: { include: { struggle: true } },

    campaigns: true,
    surveys: true,
    currency: true,
  };

  static querySelect: Prisma.PlatformProductOrderSelect = {
    client: {
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        ambassador: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    },
    platformProductOrderLocations: { select: { id: true, location: true } },
    platformProductOrderDiseaseAreas: {
      select: { id: true, diseaseArea: true },
    },
    platformProductOrderInterests: { select: { id: true, interest: true } },
    platformProductOrderEthnicities: { select: { id: true, ethnicity: true } },
    platformProductOrderStruggles: { select: { id: true, struggle: true } },
    id: true,
    ambassadorCommission: true,
    budget: true,
    currency: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  };

  static queryIncludeInfluencer: Prisma.PlatformProductOrderInfluencerInclude =
    {
      influencer: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      productOrder: {
        include: {
          campaigns: true,
          surveys: true,
          currency: true,
        },
      },
    };

  async addInfluencers(dto: AddInfluencersDto) {
    return await this.prismaService
      .$transaction(async (tx) => {
        const user = tx.user.findFirstOrThrow({
          where: { influencer: { id: dto.influencerId } },
        });

        const campaignAmount = tx.influencerCampaignAmount.findFirstOrThrow({
          where: { influencerId: dto.influencerId },
        });

        return await Promise.all([user, campaignAmount]).then(
          async ([user, campaignAmount]) => {
            return tx.platformProductOrderInfluencer.create({
              data: {
                productOrderId: dto.productOrderId,
                influencerId: dto.influencerId,
                agreedAmount: campaignAmount.desiredAmount,
                currency: user.currency,
                status: user.status,
              },
            });
          },
        );
      })
      .catch((err) => {
        throw new ConflictException('Already Exists');
      });
  }

  async createPlatformProductOrder(
    dto: CreatePlatformProductOrderDto,
    tx?: Omit<
      PrismaService,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
  ) {
    const {
      clientId,
      platformProduct,
      // currency,
      budget,
      locations,
      diseaseAreas,
      interests,
      ethnicities,
      struggles,
      status,
    } = dto;

    // await this.clientService.findOne(userId); //! WTF IS THIS?

    const generateCreateManyData = <T>(arr: number[], field: string): T => {
      const map = arr
        ? arr.map((id) => {
            return {
              [field]: id,
            };
          })
        : [];

      return {
        createMany: { data: map, skipDuplicates: true },
      } as T;
    };

    return await (tx || this.prismaService).platformProductOrder.create({
      data: {
        client: { connect: { id: clientId } },
        // ! OLD platformProduct: { connect: { id: platformProduct } },
        platformProduct,
        ambassadorCommission: new Prisma.Decimal(ambassadorCommission),
        budget: budget && new Prisma.Decimal(budget),
        // TODO review currency: currency,
        platformProductOrderLocations: generateCreateManyData(
          locations,
          'locationId',
        ),
        platformProductOrderDiseaseAreas: generateCreateManyData(
          diseaseAreas,
          'diseaseAreaId',
        ),
        platformProductOrderEthnicities: generateCreateManyData(
          ethnicities,
          'ethnicityId',
        ),
        platformProductOrderInterests: generateCreateManyData(
          interests,
          'interestId',
        ),

        platformProductOrderStruggles: generateCreateManyData(
          struggles,
          'struggleId',
        ),
        status,
      },
      include: PlatformProductOrderService.queryInclude,
    });
  }

  async findPlatformProductCampaign(id: number, user: UserEntity) {
    const platformProductCampaigns = await this.prismaService.campaign.findMany(
      {
        where: { platformProductOrderId: id },
        include: {
          platformProductOrder: {
            select: {
              id: true,
              platformProduct: true,
              clientId: true,
              status: true,
              currencyId: true,
            },
          },
        },
      },
    );
    return platformProductCampaigns[0];
  }

  async findPlatformProductSurvey(id: number, user: UserEntity) {
    const platformProductSurvey = await this.prismaService.survey.findMany({
      where: { platformProductOrderId: id },
      include: {
        platformProductOrder: {
          select: {
            id: true,
            platformProduct: true,
            clientId: true,
            status: true,
            currencyId: true,
          },
        },
      },
    });
    return platformProductSurvey[0];
  }

  async findAll({
    take,
    skip,
    sortBy,
  }: FilterParamsDto): Promise<PaginationResult<PlatformProductOrder>> {
    // ! queryOrderBy is WIP
    const queryOrderBy: Prisma.Enumerable<Prisma.PlatformProductOrderOrderByWithRelationInput> =
      // sort by comment time (descending) by the default
      (sortBy as any) || { createdAt: 'desc' };

    const res = await filterRecordsFactory(
      this.prismaService,
      (tx) => tx.platformProductOrder,
      {
        include: PlatformProductOrderService.queryInclude,
        skip,
        take,
        orderBy: queryOrderBy,
      },
    )();
    return res;
  }

  async findOneById(id: number) {
    try {
      return await this.prismaService.platformProductOrder.findFirstOrThrow({
        where: { id },
        include: PlatformProductOrderService.queryInclude,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllByUserId(userId: number, search: string) {
    try {
      const user = await this.prismaService.user.findFirstOrThrow({
        where: {
          id: userId,
        },
        skip: 0,
        take: 10,
      });

      switch (user.role) {
        case UserRole.Client:
          const clientsProducts =
            await this.prismaService.platformProductOrder.findMany({
              where: {
                client: {
                  userId,
                },
                OR: [
                  {
                    campaigns: {
                      some: {
                        name: {
                          contains: search ? search : '',
                          mode: 'insensitive',
                        },
                      },
                    },
                  },
                  {
                    surveys: {
                      some: {
                        name: {
                          contains: search ? search : '',
                          mode: 'insensitive',
                        },
                      },
                    },
                  },
                ],
              },
              include: {
                campaigns: true,
                surveys: true,
              },
            });

          const clientCampaigns = clientsProducts.map((item) => item.campaigns);

          const clientSurveys = clientsProducts.map((item) => item.surveys);

          return [...clientCampaigns.flat(), ...clientSurveys.flat()];

        case UserRole.Influencer:
          const influencersProducts =
            await this.prismaService.platformProductOrderInfluencer.findMany({
              where: {
                influencer: {
                  userId,
                },
                productOrder: {
                  campaigns: search?.length
                    ? {
                        some: {
                          name: search && {
                            contains: search,
                            mode: 'insensitive',
                          },
                        },
                      }
                    : undefined,
                  surveys: search?.length
                    ? {
                        some: {
                          name: search && {
                            contains: search,
                            mode: 'insensitive',
                          },
                        },
                      }
                    : undefined,
                },
              },
              include: {
                productOrder: {
                  include: {
                    campaigns: true,
                    surveys: true,
                  },
                },
              },
            });

          const influencerCampaigns = influencersProducts.map(
            (item) => item.productOrder.campaigns,
          );

          const influencerSurveys = influencersProducts.map(
            (item) => item.productOrder.surveys,
          );

          return [...influencerCampaigns.flat(), ...influencerSurveys.flat()];

        case UserRole.Ambassador:
          const ambassadorProducts =
            await this.prismaService.platformProductOrder.findMany({
              where: {
                client: {
                  ambassador: {
                    userId,
                  },
                },
                campaigns: {
                  some: {
                    name: search && { contains: search, mode: 'insensitive' },
                  },
                },
                surveys: {
                  some: {
                    name: search && { contains: search, mode: 'insensitive' },
                  },
                },
              },
              include: {
                campaigns: true,
                surveys: true,
              },
            });

          const ambassadorCampaigns = ambassadorProducts.map(
            (item) => item.campaigns,
          );

          const ambassadorSurveys = ambassadorProducts.map(
            (item) => item.surveys,
          );

          return [...ambassadorCampaigns.flat(), ...ambassadorSurveys.flat()];
      }
    } catch (error) {
      throw error;
    }
  }

  async findOneByIdInfluencersCampaing(
    { skip, take }: FilterParamsDto,
    id: number,
    user: UserEntity,
  ) {
    try {
      const queryWhere: Prisma.PlatformProductOrderInfluencerWhereInput = {
        productOrder: {
          id: id,
        },
        // name: search && { contains: search, mode: 'insensitive' },
        // platformProductOrder: {
        //   platformProductOrderInfluencers:
        //     user.role === UserRole.Influencer
        //       ? {
        //           some: {
        //             // influencerId: user.influencer.id,
        //             influencer: {
        //               userId: user.id,
        //             },
        //           },
        //         }
        //       : undefined,
        // },
      };

      const campaing = await this.prismaService.campaign.findFirstOrThrow({
        where: {
          platformProductOrderId: id,
        },
        select: {
          id: true,
        },
      });

      const include: Prisma.PlatformProductOrderInfluencerInclude = {
        influencer:
          user.role === UserRole.SuperAdmin ||
          user.role === UserRole.Admin ||
          user.role === UserRole.Client
            ? {
                include: {
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                      status: true,
                    },
                  },
                  stakeholders: true,
                  influencerDiseaseAreas: {
                    select: {
                      id: true,
                      diseaseAreaId: true,
                      diseaseArea: {
                        select: {
                          id: true,
                          name: true,
                          parentDiseaseArea: {
                            select: {
                              id: true,
                              name: true,
                            },
                          },
                        },
                      },
                    },
                  },
                  campaignInfluencerPerformances: {
                    where: {
                      campaignId: campaing.id,
                    },
                  },
                },
              }
            : undefined,
      };

      const platformInfluencers = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.platformProductOrderInfluencer,
        {
          where: queryWhere,
          include: include,
          skip,
          take,
        },
      )();

      if (user.role === UserRole.Client) {
        const modifiedInfluencers = platformInfluencers.result.map(
          (influencer, index) => {
            const { agreedAmount, ...restInfluencer } = influencer;
            if (
              [
                ProductOrderInfluencerStatus.Added,
                ProductOrderInfluencerStatus.Invited,
                ProductOrderInfluencerStatus.NotSelected,
              ].includes(influencer.status)
            ) {
              return {
                ...restInfluencer,
                influencer: {
                  ...restInfluencer.influencer,
                  stakeholders: [
                    {
                      ...restInfluencer.influencer.stakeholders[0],
                      socialPlatformUserId: undefined,
                      socialPlatformUsername: `Influencer ${index + 1}`,
                      iv: undefined,
                      bio: undefined,
                      type: undefined,
                      isRegistered: undefined,
                      influencerId: undefined,
                      locationId: undefined,
                      dateOfBirth: undefined,
                    },
                  ],
                  user: {
                    ...restInfluencer.influencer.user,
                    firstName: '',
                    lastName: undefined,
                    email: undefined,
                  },
                },
              };
            } else {
              return restInfluencer;
            }
          },
        );

        platformInfluencers.result = modifiedInfluencers;
      }

      return platformInfluencers;
    } catch (error) {
      throw error;
    }
  }

  async findOneByIdInfluencersSurvey(
    { skip, take }: FilterParamsDto,
    id: number,
    user: UserEntity,
  ) {
    try {
      const queryWhere: Prisma.PlatformProductOrderInfluencerWhereInput = {
        productOrder: {
          id: id,
        },
        // name: search && { contains: search, mode: 'insensitive' },
        // platformProductOrder: {
        //   platformProductOrderInfluencers:
        //     user.role === UserRole.Influencer
        //       ? {
        //           some: {
        //             // influencerId: user.influencer.id,
        //             influencer: {
        //               userId: user.id,
        //             },
        //           },
        //         }
        //       : undefined,
        // },
      };

      const include: Prisma.PlatformProductOrderInfluencerInclude = {
        influencer:
          user.role === UserRole.SuperAdmin ||
          user.role === UserRole.Admin ||
          user.role === UserRole.Client
            ? {
                include: {
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                      status: true,
                      location: {
                        select: {
                          id: true,
                          name: true,
                          country: {
                            select: {
                              id: true,
                              name: true,
                            },
                          },
                        },
                      },
                    },
                  },
                  stakeholders: true,
                  influencerDiseaseAreas: {
                    select: {
                      id: true,
                      diseaseAreaId: true,
                      diseaseArea: {
                        select: {
                          id: true,
                          name: true,
                          parentDiseaseArea: {
                            select: {
                              id: true,
                              name: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              }
            : undefined,
      };

      const platformInfluencers = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.platformProductOrderInfluencer,
        {
          where: queryWhere,
          include: include,
          skip,
          take,
        },
      )();

      if (user.role === UserRole.Client) {
        const modifiedInfluencers = platformInfluencers.result.map(
          (influencer, index) => {
            const { agreedAmount, ...restInfluencer } = influencer;
            if (
              [
                ProductOrderInfluencerStatus.Added,
                ProductOrderInfluencerStatus.Invited,
                ProductOrderInfluencerStatus.NotSelected,
              ].includes(influencer.status)
            ) {
              return {
                ...restInfluencer,
                influencer: {
                  ...restInfluencer.influencer,

                  stakeholders: [
                    {
                      ...restInfluencer.influencer.stakeholders[0],
                      socialPlatformUserId: undefined,
                      socialPlatformUsername: `Participant ${index + 1}`,
                      iv: undefined,
                      bio: undefined,
                      type: undefined,
                      isRegistered: undefined,
                      influencerId: undefined,
                      locationId: undefined,
                      dateOfBirth: undefined,
                    },
                  ],
                  user: {
                    ...restInfluencer.influencer.user,
                    firstName: '',
                    lastName: undefined,
                    email: undefined,
                    // location: undefined,
                  },
                },
              };
            } else {
              return restInfluencer;
            }
          },
        );

        platformInfluencers.result = modifiedInfluencers;
      }

      return platformInfluencers;
    } catch (error) {
      throw error;
    }
  }

  async updateOneById(
    id: number,
    dto: UpdatePlatformProductOrderDto,
    tx?: Omit<
      PrismaService,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
  ) {
    if (tx) {
      return await this.updateTransact(id, dto, tx);
    }

    return await this.prismaService.$transaction(
      async (newTx) => await this.updateTransact(id, dto, newTx),
    );
  }

  private async updateTransact(
    productOrderId: number,
    dto: UpdatePlatformProductOrderDto,
    tx: Omit<
      PrismaService,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
  ) {
    const {
      // currency,
      budget,
      locations,
      diseaseAreas,
      interests,
      ethnicities,
      struggles,
      financeStatus,
    } = dto;

    const generateDeleteManyAndCreateMany = (
      condition: number[],
      connectOrCreateField: string,
    ) => {
      const map = condition
        ? condition.map((id) => {
            return {
              [connectOrCreateField]: id,
            };
          })
        : [];

      // const map = (condition || []).map((id) => ({
      //   [connectOrCreateField]: id,
      // }));

      return {
        ...(condition !== undefined
          ? condition !== null
            ? {
                deleteMany: {
                  NOT: { [connectOrCreateField]: { in: condition } },
                },
                createMany: { data: map, skipDuplicates: true },
              }
            : { deleteMany: { productOrderId } }
          : {}),
      };
    };

    return await tx.platformProductOrder.update({
      where: { id: productOrderId },
      data: {
        // TODO review currency,
        budget,
        financeStatus,
        platformProductOrderLocations: generateDeleteManyAndCreateMany(
          locations,
          'locationId',
        ),
        platformProductOrderEthnicities: generateDeleteManyAndCreateMany(
          ethnicities,
          'ethnicityId',
        ),
        platformProductOrderDiseaseAreas: generateDeleteManyAndCreateMany(
          diseaseAreas,
          'diseaseAreaId',
        ),
        platformProductOrderInterests: generateDeleteManyAndCreateMany(
          interests,
          'interestId',
        ),
        platformProductOrderStruggles: generateDeleteManyAndCreateMany(
          struggles,
          'struggleId',
        ),
      },
      include: PlatformProductOrderService.queryInclude,
    });
  }

  parseCustomDate(dateString: string) {
    const parts = dateString.match(/(\d+)/g);
    const year = parseInt(parts[2], 10);
    const month = parseInt(parts[0], 10) - 1; // Months are 0-based
    const day = parseInt(parts[1], 10);

    return new Date(Date.UTC(year, month, day, 0, 0, 0));
  }

  async findAllByFinanceStatus(
    { take, skip, sortBy }: FilterParamsDto,
    financeStatus: FinanceStatus,
    filters: RevenueFilterDto,
  ): Promise<PaginationResult<PlatformProductOrder>> {
    const queryOrderBy: Prisma.Enumerable<Prisma.PlatformProductOrderOrderByWithRelationInput> =
      (sortBy as any) || { createdAt: 'desc' };

    const queryWhere: Prisma.PlatformProductOrderWhereInput = {
      financeStatus,
      budget: {
        gte: filters.budgetMin || undefined,
        lte: filters.budgetMax || undefined,
      },
      client: {
        userId: filters.clientIds?.length
          ? {
              in: filters.clientIds,
            }
          : undefined,
        companyId: filters.companyIds?.length
          ? {
              in: filters.companyIds,
            }
          : undefined,
        ambassador: filters.ambassadorIds?.length
          ? {
              userId: {
                in: filters.ambassadorIds,
              },
            }
          : undefined,
      },
    };

    const filteredRevenueProducts =
      await this.prismaService.platformProductOrder.findMany({
        where: queryWhere,
        include: {
          campaigns: true,
          surveys: true,
        },
      });

    const filteredRevenueProductIds = filteredRevenueProducts
      .filter((product) => {
        let isMatch = true;

        if (filters.startDate !== undefined) {
          const parsedStartDate = this.parseCustomDate(filters.startDate);

          const databaseDate = product.updatedAt;
          databaseDate.setUTCHours(0, 0, 0, 0);

          isMatch &&= databaseDate >= parsedStartDate;
        }

        if (filters.endDate !== undefined) {
          const parsedEndDate = this.parseCustomDate(filters.endDate);

          const databaseDate = product.updatedAt;
          databaseDate.setUTCHours(0, 0, 0, 0);

          isMatch &&= databaseDate <= parsedEndDate;
        }

        if (filters.campaignIds === undefined && filters.surveyIds?.length) {
          isMatch &&= product.surveys.some((survey) =>
            filters.surveyIds.includes(survey.id),
          );
        }

        if (filters.surveyIds === undefined && filters.campaignIds?.length) {
          isMatch &&= product.campaigns.some((campaign) =>
            filters.campaignIds.includes(campaign.id),
          );
        }

        if (
          filters.surveyIds !== undefined &&
          filters.campaignIds !== undefined
        ) {
          const existingCampaign = product.campaigns.some((campaign) =>
            filters.campaignIds.includes(campaign.id),
          );

          const existingSurvey = product.surveys.some((survey) =>
            filters.surveyIds.includes(survey.id),
          );

          isMatch &&= existingCampaign || existingSurvey;
        }

        return isMatch;
      })
      .map((product) => product.id);

    queryWhere.id = {
      in: filteredRevenueProductIds,
    };

    const res = await filterRecordsFactory(
      this.prismaService,
      (tx) => tx.platformProductOrder,
      {
        include: PlatformProductOrderService.queryInclude,
        skip,
        take,
        orderBy: queryOrderBy,
        where: queryWhere,
      },
    )();
    return res;
  }

  async getAllByFinanceStatus(dto: FindByIdsDto) {
    const results = await this.prismaService.platformProductOrder.findMany({
      where: {
        financeStatus: dto.financeStatus,
        id: {
          in: dto.ids,
        },
        budget: {
          not: null,
        },
      },
      include: {
        client: {
          include: {
            user: true,
          },
        },
        campaigns: true,
        surveys: true,
      },
    });

    const currency = {
      1: 'EUR',
      2: 'USD',
      3: 'CHF',
    };

    const status = {
      0: 'Pending',
      1: 'Received',
    };

    const project = (index: number) => {
      if (results[index].campaigns.length > 0) {
        return results[index].campaigns
          .map((campaign) => campaign.name)
          .join(', ');
      }

      if (results[index].surveys.length > 0) {
        return results[index].surveys.map((survey) => survey.name).join(', ');
      }
    };

    return results.map((item, idx) => {
      return {
        project: project(idx),
        date: item.createdAt,
        currency: currency[item.currencyId],
        amount: item.budget.toNumber(),
        status: status[item.financeStatus],
        user: `${item.client.user.firstName} ${item.client.user.lastName}`,
      };
    });
  }

  async receivePendingRevenues(dto: ReceivePendingRevenuesDto) {
    const { productIds } = dto;
    try {
      const existingOrders =
        await this.prismaService.platformProductOrder.findMany({
          where: {
            id: { in: productIds },
          },
          select: {
            id: true,
          },
        });

      const existingOrderIds = existingOrders.map((order) => order.id);
      const missingOrderIds = productIds.filter(
        (id) => !existingOrderIds.includes(id),
      );

      if (missingOrderIds.length > 0) {
        throw new ConflictException(
          `Product order with id ${missingOrderIds.join(', ')} does not exist`,
        );
      }

      const updatedOrders = await this.prismaService.$transaction(
        existingOrderIds.map((id) =>
          this.prismaService.platformProductOrder.update({
            where: { id },
            data: { financeStatus: FinanceStatus.Received },
          }),
        ),
      );

      return updatedOrders;
    } catch (error) {
      throw error;
    }
  }

  async findAllApprovedAgreedAmounts({
    take,
    skip,
    sortBy,
  }: FilterParamsDto): Promise<
    PaginationResult<PlatformProductOrderInfluencer>
  > {
    const queryWhere: Prisma.PlatformProductOrderInfluencerWhereInput = {
      status: {
        in: [
          ProductOrderInfluencerStatus.ToBePaid,
          ProductOrderInfluencerStatus.Paid,
          ProductOrderInfluencerStatus.Declined,
        ],
      },
    };

    const queryOrderBy: Prisma.Enumerable<Prisma.PlatformProductOrderInfluencerOrderByWithRelationInput> =
      (sortBy as any) || { createdAt: 'desc' };

    const res = await filterRecordsFactory(
      this.prismaService,
      (tx) => tx.platformProductOrderInfluencer,
      {
        include: PlatformProductOrderService.queryIncludeInfluencer,
        skip,
        take,
        orderBy: queryOrderBy,
        where: queryWhere,
      },
    )();

    return res;
  }

  async updatePlatformProductPayments(dto: ApprovePaymentsDto) {
    const { paymentIds, status } = dto;

    try {
      const existingPayments =
        await this.prismaService.platformProductOrderInfluencer.findMany({
          where: {
            id: { in: paymentIds },
            status: {
              in: [
                ProductOrderInfluencerStatus.Declined,
                ProductOrderInfluencerStatus.ToBePaid,
                ProductOrderInfluencerStatus.Paid,
              ],
            },
          },
          select: {
            id: true,
          },
        });

      const existingPaymentIds = existingPayments.map((payment) => payment.id);
      const missingPaymentIds = paymentIds.filter(
        (id) => !existingPaymentIds.includes(id),
      );

      if (missingPaymentIds.length > 0) {
        throw new ConflictException(
          `Payment with id ${missingPaymentIds.join(', ')} does not exist`,
        );
      }

      const updatedPayments = await this.prismaService.$transaction(
        existingPaymentIds.map((id) =>
          this.prismaService.platformProductOrderInfluencer.update({
            where: { id },
            data: { status },
          }),
        ),
      );

      return updatedPayments;
    } catch (error) {
      throw error;
    }
  }
}
