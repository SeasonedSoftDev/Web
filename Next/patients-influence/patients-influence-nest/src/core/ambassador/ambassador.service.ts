import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../integrations/prisma/prisma.service';
import { AmbassadorRegistrationDto } from './dto/';
import { Hash, UserRole, UserStatus, generateAffiliateCode } from '../../utils';
import { MailService } from '../../integrations/mail/mail.service';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import sendgridConfig from 'src/config/sendgrid.config';
import { ConfigType } from '@nestjs/config';
import { throwIfEmailExists } from '../users/exceptions/utils/email-exists';
import { UpdateAmbassadorDto } from './dto/update-ambassador.dto';
import { Company, Prisma } from '@prisma/client';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { ApplicationException } from 'src/exceptions/application.exception';
import { JsonWebTokenError } from 'jsonwebtoken';
import { AmbassadorTokenPayload } from '../admin/types/ambassador-token-payload.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Legal } from '../common/legals/enums/legal.enum';
import lodash from 'lodash';
import { LocationTableResponseEntity } from '../influencer/entities/influencer-table-response.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { AmbassadorFilterDto } from './dto/ambassador-filter.dto';
import { addDays } from 'date-fns';

@Injectable()
export class AmbassadorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationsService,

    @Inject(sendgridConfig.KEY)
    private readonly _sendgridConfig: ConfigType<typeof sendgridConfig>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  static queryInclude: Prisma.UserInclude = {
    ambassador: {
      include: {
        company: true,
        companyTitle: true,
        industry: true,
        clients: true,
      },
    },
  };

  async register(
    token: string,
    dto: AmbassadorRegistrationDto,
    options?: { language: string },
  ) {
    try {
      const cache = await this.cacheManager.get(JSON.stringify(token));

      if (cache === undefined)
        throw new BadRequestException('Token timed out!');

      const payload: AmbassadorTokenPayload = this.jwtService.verify(token);

      const {
        firstName,
        lastName,
        email,
        password,
        companyTitleId,
        company,
        commonLegalId,
      } = dto;

      // check if legals are in place
      const commonLegalLast = await this.prismaService.legal.findFirstOrThrow({
        where: { type: Legal.Common },
        orderBy: { createdAt: 'desc' },
      });

      /* if (commonLegalLast.id !== commonLegalId) {
        throw new BadRequestException(
          `Legal (${Legal.Common}) is not the newest`,
        );
      } */

      const ambassador = await this.prismaService.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            firstName,
            lastName,
            email,
            password: await Hash(password),
            role: UserRole.Ambassador,
            status: UserStatus.Unconfirmed,
            legalConsents: {
              createMany: {
                data: [
                  {
                    legalId: commonLegalId,
                  },
                ],
              },
            },
          },
        });

        let newCompany: Company;

        if (company.companyId === undefined) {
          const existingCompany = await tx.company.findFirst({
            where: { name: company.name },
          });
          if (existingCompany === null) {
            newCompany = await tx.company.create({
              data: {
                name: company.name,
                createdByUser: { connect: { id: user.id } },
              },
            });
          } else {
            newCompany = existingCompany;
          }
        }

        const ambassador = await tx.ambassador.create({
          data: {
            user: { connect: { id: user.id } },
            company: company.companyId
              ? { connect: { id: company.companyId } }
              : { connect: { id: newCompany.id } },
            companyTitle: { connect: { id: companyTitleId } },
            affiliateCode: generateAffiliateCode(),
            invitedByAdmin: { connect: { id: payload.invitedByAdmin } },
          },
          include: { user: true },
        });

        return ambassador;
      });

      await this.cacheManager.del(JSON.stringify(token));

      const user = await this.prismaService.user.findFirst({
        where: { id: ambassador.user.id },
        include: AmbassadorService.queryInclude,
      });

      if (user) {
        await this.notificationService.welcomeUserAfterRegistration(user.id);
      }

      await this.mailService.sendConfirmationEmail(
        user.id,
        user.email,
        user.role,
        user.firstName,
        options.language,
      );

      return user;
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        throw new ApplicationException('Invalid Jwt!');
      throwIfEmailExists(error);
      throw error;
    }
  }

  async findOne(id: number, includeAffiliates = false) {
    try {
      const ambassador = await this.prismaService.user.findFirstOrThrow({
        where: { id, isDeleted: false, role: UserRole.Ambassador },
        include: !includeAffiliates
          ? AmbassadorService.queryInclude
          : lodash.merge<Prisma.UserInclude, Prisma.UserInclude>(
              AmbassadorService.queryInclude,
              {
                ambassador: {
                  include: {
                    clients: { include: { user: true, products: true } },
                  },
                },
              },
            ),
      });

      return ambassador;
    } catch (error) {
      // * can throw PrismaClientKnownRequestError P2025
      throw error;
    }
  }

  async findAll(
    { skip, take, sortBy }: FilterParamsDto,
    filters: AmbassadorFilterDto,
  ) {
    const userFilterQuery: Prisma.UserWhereInput = {
      OR: [
        {
          firstName: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          AND: [
            {
              firstName: {
                contains: filters.search.split(' ')[0], // Search for the first part of the full name
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: filters.search.split(' ')[1], // Search for the second part of the full name
                mode: 'insensitive',
              },
            },
          ],
        },
        {
          email: { contains: filters.search, mode: 'insensitive' },
        },
        {
          location: {
            name: { contains: filters.search, mode: 'insensitive' },
          },
        },
        {
          location: {
            country: {
              name: { contains: filters.search, mode: 'insensitive' },
            },
          },
        },
        {
          ambassador: {
            company: {
              name: {
                contains: filters.search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          ambassador: {
            companyTitle: {
              name: {
                contains: filters.search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          ambassador: {
            industry: {
              name: {
                contains: filters.search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          ambassador: {
            clients: {
              some: {
                OR: [
                  {
                    user: {
                      OR: [
                        {
                          firstName: {
                            contains: filters.search,
                            mode: 'insensitive',
                          },
                        },
                        {
                          lastName: {
                            contains: filters.search,
                            mode: 'insensitive',
                          },
                        },
                        {
                          AND: [
                            {
                              firstName: {
                                contains: filters.search.split(' ')[0],
                                mode: 'insensitive',
                              },
                            },
                            {
                              lastName: {
                                contains: filters.search.split(' ')[1],
                                mode: 'insensitive',
                              },
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      ],
      role: UserRole.Ambassador,
      isDeleted: false,
      createdAt: (filters.joinedFrom || filters.joinedTo) && {
        gte: filters.joinedFrom,
        lte: filters.joinedTo,
      },
      ambassador: {
        companyTitle: {
          id: filters.roleIds?.length ? { in: filters.roleIds } : undefined,
        },
        company: {
          id: filters.companyIds?.length
            ? { in: filters.companyIds }
            : undefined,
        },
        clients:
          ((filters.search.length && Object.keys(filters).length > 1) ||
            (!filters.search.length && Object.keys(filters).length)) &&
          (filters.industryIds ||
            filters.marketIds ||
            filters.productIds ||
            filters.diseaseAreaIds ||
            filters.locationIds ||
            filters.project ||
            filters.projectStatus)
            ? {
                some: {
                  // OR: [
                  // {
                  AND: [
                    filters.marketIds
                      ? {
                          OR: [
                            {
                              clientMarkets: {
                                some: {
                                  location: {
                                    id: filters.marketIds?.length
                                      ? { in: filters.marketIds }
                                      : undefined,
                                  },
                                },
                              },
                            },
                            {
                              clientMarkets: {
                                some: {
                                  location: {
                                    country: {
                                      id: filters.marketIds?.length
                                        ? { in: filters.marketIds }
                                        : undefined,
                                    },
                                  },
                                },
                              },
                            },
                          ],
                        }
                      : undefined,
                  ],
                  industry: {
                    id: filters.industryIds?.length
                      ? { in: filters.industryIds }
                      : undefined,
                  },
                  platformProductOrder: {
                    some: {
                      platformProduct: filters.project || undefined,
                      status: filters.projectStatus || undefined,
                    },
                  },
                  clientProducts: filters.productIds?.length
                    ? {
                        some: {
                          product: {
                            id: filters.productIds?.length
                              ? { in: filters.productIds }
                              : undefined,
                          },
                        },
                      }
                    : undefined,
                  // },
                  // {
                  clientDiseaseAreas: filters.diseaseAreaIds?.length
                    ? {
                        some: {
                          diseaseArea: {
                            id: filters.diseaseAreaIds?.length
                              ? { in: filters.diseaseAreaIds }
                              : undefined,
                          },
                        },
                      }
                    : undefined,
                  user: {
                    location: filters.locationIds
                      ? {
                          id: filters.locationIds?.length
                            ? { in: filters.locationIds }
                            : undefined,
                        }
                      : undefined,
                  },
                  // },
                  // ],
                },
              }
            : undefined,
      },
    };

    // const ambassadorsFilteredWithProjects =
    //   await this.prismaService.ambassador.findMany({
    //     where: {
    //       user: userFilterQuery,
    //     },
    //     include: {
    //       clients: true,
    //       user: {
    //         select: {
    //           transactionFlow: true,
    //         },
    //       },
    //     },
    //   });
    const ambassadorsFilteredWithProjects =
      await this.prismaService.ambassador.findMany({
        where: {
          user: userFilterQuery,
        },
        include: {
          clients: {
            select: {
              platformProductOrder: {
                select: {
                  id: true,
                  createdAt: true,
                },
              },
            },
          },
          user: {
            select: {
              transactionFlow: true,
            },
          },
        },
      });

    const ambassadorClientFilterIds = ambassadorsFilteredWithProjects
      .filter((ambassador) => {
        let isMatch = false;

        if (
          filters.clientsMin === undefined &&
          filters.clientsMax === undefined
        ) {
          isMatch = true;
        }

        if (
          filters.clientsMin !== undefined &&
          filters.clientsMax === undefined
        ) {
          isMatch = ambassador.clients.length >= filters.clientsMin;
        }

        if (
          filters.clientsMin === undefined &&
          filters.clientsMax !== undefined
        ) {
          isMatch = ambassador.clients.length <= filters.clientsMax;
        }

        if (
          filters.clientsMin !== undefined &&
          filters.clientsMax !== undefined
        ) {
          isMatch =
            ambassador.clients.length >= filters.clientsMin &&
            ambassador.clients.length <= filters.clientsMax;
        }

        return isMatch;
      })
      .map((ambassador) => ambassador.userId);

    // todo get transaction filtered from there

    let date30DaysAgo = new Date();
    date30DaysAgo.setHours(0, 0, 0, 0);
    date30DaysAgo = addDays(date30DaysAgo, -30);

    const ambassadorsWithMinMaxProjects = ambassadorsFilteredWithProjects
      .filter(
        (ambassador) => {
          let isMatch = false;

          if (
            filters.totalProjectsMin === undefined &&
            filters.totalProjectsMax === undefined &&
            filters.projectsLast30DaysMin === undefined &&
            filters.projectsLast30DaysMax === undefined
          ) {
            isMatch = true;
          }

          // * total projects filter
          if (
            filters.totalProjectsMin !== undefined &&
            filters.totalProjectsMax === undefined &&
            filters.projectsLast30DaysMin === undefined &&
            filters.projectsLast30DaysMax === undefined
          ) {
            isMatch = !!ambassador.clients.find(
              (client) =>
                filters.totalProjectsMin <= client.platformProductOrder.length,
            )?.platformProductOrder;
          }
          if (
            filters.totalProjectsMin === undefined &&
            filters.totalProjectsMax !== undefined &&
            filters.projectsLast30DaysMin === undefined &&
            filters.projectsLast30DaysMax === undefined
          ) {
            isMatch = false;
            isMatch = !!ambassador.clients.find(
              (client) =>
                client.platformProductOrder &&
                filters.totalProjectsMax >= client.platformProductOrder.length,
            )?.platformProductOrder;
          }

          if (
            filters.totalProjectsMin !== undefined &&
            filters.totalProjectsMax !== undefined &&
            filters.projectsLast30DaysMin === undefined &&
            filters.projectsLast30DaysMax === undefined
          ) {
            isMatch = false;
            isMatch =
              !!ambassador.clients.find(
                (client) =>
                  client.platformProductOrder.length <=
                  filters.totalProjectsMax,
              )?.platformProductOrder &&
              !!ambassador.clients.find(
                (client) =>
                  client.platformProductOrder.length &&
                  filters.totalProjectsMin <=
                    client.platformProductOrder.length,
              )?.platformProductOrder;
          }

          // * projects last 30 days filter

          if (
            filters.projectsLast30DaysMin !== undefined ||
            filters.projectsLast30DaysMax !== undefined
          ) {
            const platformProducts = ambassador.clients
              .map((client) => client.platformProductOrder)
              .map((clientPlatformProduct) => {
                return clientPlatformProduct.filter(
                  (platProd) => platProd.createdAt >= date30DaysAgo,
                );
              });

            if (
              filters.projectsLast30DaysMin !== undefined &&
              filters.projectsLast30DaysMax === undefined
            ) {
              isMatch = !!platformProducts.find(
                (clientPlatforms) =>
                  filters.projectsLast30DaysMin <= clientPlatforms.length,
              );
            }
            if (
              filters.projectsLast30DaysMax !== undefined &&
              filters.projectsLast30DaysMin === undefined
            ) {
              isMatch = !!platformProducts.find(
                (clientPlatforms) =>
                  clientPlatforms.length &&
                  clientPlatforms.length <= filters.projectsLast30DaysMax,
              );
            }

            if (
              filters.projectsLast30DaysMin !== undefined &&
              filters.projectsLast30DaysMax !== undefined
            ) {
              isMatch =
                !!platformProducts.find(
                  (clientPlatforms) =>
                    filters.projectsLast30DaysMin <= clientPlatforms.length,
                ) &&
                !!platformProducts.find(
                  (clientPlatforms) =>
                    clientPlatforms.length &&
                    clientPlatforms.length <= filters.projectsLast30DaysMax,
                );
            }
          }

          return isMatch;
        },
        /* // * total projects filter
        (filters.totalProjectsMin <= client.platformProductOrder.length &&
          filters.totalProjectsMax >= client.platformProductOrder.length) ||
        // * projects last 30 days filter
        client.platformProductOrder.find(
          (order) => order.createdAt >= date30DaysAgo,
        ), */
      )
      .map((ambassador) => ambassador.userId);

    // TODO use this with set for first part

    const ambassadorWithMinMaxCommissionSum = ambassadorsFilteredWithProjects
      .filter((ambassador) => {
        let isMatch = true;

        if (
          filters.commissionMin !== undefined &&
          filters.commissionMax === undefined
        ) {
          isMatch = !!ambassador.user.transactionFlow.find(
            (transactionFlow) =>
              transactionFlow.amount.toNumber() >= filters.commissionMin,
          );
        }

        if (
          filters.commissionMin === undefined &&
          filters.commissionMax !== undefined
        ) {
          isMatch = !!ambassador.user.transactionFlow.find(
            (transactionFlow) =>
              transactionFlow.amount.toNumber() <= filters.commissionMax,
          );
        }

        if (
          filters.commissionMin !== undefined &&
          filters.commissionMax !== undefined
        ) {
          isMatch =
            !!ambassador.user.transactionFlow.find(
              (transactionFlow) =>
                transactionFlow.amount.toNumber() >= filters.commissionMin,
            ) &&
            !!ambassador.user.transactionFlow.find(
              (transactionFlow) =>
                transactionFlow.amount.toNumber() <= filters.commissionMax,
            );
        }

        return isMatch;
      })
      .map((ambassador) => ambassador.userId);

    const ambassadorsWithMinMaxProjectsSet = new Set(
      ambassadorsWithMinMaxProjects,
    );
    const ambassadorWithMinMaxCommissionSumSet = new Set(
      ambassadorWithMinMaxCommissionSum,
    );

    const ambassadorClientFilterIdsSet = new Set(ambassadorClientFilterIds);

    const clientsMinMaxFilteredUserIds = [...ambassadorsWithMinMaxProjectsSet]
      .filter((item) => ambassadorWithMinMaxCommissionSumSet.has(item))
      .filter((item) => ambassadorClientFilterIdsSet.has(item));

    // queryWhere.isDeleted = false;
    const queryInclude: Prisma.UserInclude = lodash.merge<
      Prisma.UserInclude,
      Prisma.UserInclude
    >(AmbassadorService.queryInclude, {
      ambassador: {
        include: {
          clients: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          user: {
            include: {
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
        },
      },
    });
    const queryOrderBy: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput> =
      (sortBy as any) || { createdAt: 'desc' };
    userFilterQuery.id = { in: clientsMinMaxFilteredUserIds };
    try {
      const result = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.user,
        {
          where: {
            ...userFilterQuery,
            // ambassador: { ...ambassadorFilterQuery },
          },
          include: queryInclude,
          skip,
          take,
          orderBy: queryOrderBy,
        },
      )();

      const formattedResult = {
        ...result,
        result: result.result.map((ambassador) => {
          return {
            ...ambassador,
            ambassador: {
              ...ambassador.ambassador,
              user: {
                ...ambassador.ambassador.user,
                password: undefined,
                emailResendTokens: undefined,
                isDeleted: undefined,
                role: undefined,
                status: undefined,
                location: ambassador.ambassador.user.location
                  ? new LocationTableResponseEntity({
                      id: ambassador.ambassador.user.location.id,
                      name: ambassador.ambassador.user.location.name,
                      country:
                        ambassador.ambassador.user.location.country &&
                        new LocationTableResponseEntity(
                          ambassador.ambassador.user.location.country,
                        ),
                    })
                  : undefined,
              },
            },
          };
        }),
      };

      return formattedResult;
    } catch (error) {
      throw error;
    }
  }

  async updateOneById(id: number, dto: UpdateAmbassadorDto) {
    const {
      firstName,
      lastName,
      email,
      password,
      locationId,
      currency,
      company,
      companyTitleId,
      industryId,
    } = dto;

    return await this.prismaService.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        password,
        locationId,
        currency,
        ambassador: {
          update: { companyTitleId, companyId: company.companyId, industryId },
        },
      },
      include: AmbassadorService.queryInclude,
    });
  }

  async deleteOne(id: number) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: { isDeleted: true },
      });
    } catch (error) {
      // * can throw PrismaClientKnownRequestError P2025
      throw error;
    }
  }

  async affiliateCodeOwner(affiliateCode: string) {
    return await this.prismaService.ambassador.findFirstOrThrow({
      where: {
        affiliateCode,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}
