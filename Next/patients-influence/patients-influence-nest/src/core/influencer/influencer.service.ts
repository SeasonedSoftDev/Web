import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Influencer,
  InfluencerCampaignAmount,
  InfluencerDiseaseArea,
  InfluencerSurveyAmount,
  Prisma,
  Stakeholder,
  SocialPlatform as SocialPlatformModel,
  User,
  PatientCaregiverDiseaseArea,
  DiseaseArea,
  Location,
  Ethnicity,
  UserLabel,
  Label,
  StakeholderPost,
  PostTheme,
  Theme,
  PostSymptom,
  Symptom,
  PostDiseaseArea,
  PostStruggle,
} from '@prisma/client';
import { InfluencerRegistrationDto } from '../influencer/dto/influencer-registration.dto';
import { MailService } from '../../integrations/mail/mail.service';
import {
  FilterUnit,
  Hash,
  StakeholderType,
  UserRole,
  UserStatus,
  calculateDOB,
  generateAffiliateCode,
} from '../../utils';
import { PrismaService } from '../../integrations/prisma/prisma.service';
import { throwIfEmailExists } from '../users/exceptions/utils/email-exists';
import { FilterParamsDto } from './dto/query-params/filter-params.dto';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { PaginationParamsDto } from 'src/utils/object-definitions/dtos/pagination-params.dto';
import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { InfluencerRegistrationViaInvitationDto } from './dto/influencer-registration-via-invitation.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';
import { InfluencerNotFoundException } from './exceptions/influencer.exception';
import { generateRelatedModelCRUDFactory } from 'src/utils/factories/generate-related-model-crud.factory';
import { InstagramService } from 'src/integrations/social/instagram/instagram.service';
import { StakeholdersService } from '../stakeholders/stakeholders.service';
import { SendEmailDto } from './dto/send-email.dto';
import { FilterParamsDto as FilterParamsObjectDefDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import {
  DiscoverInfluencerStage,
  DiscoverInfluencersFilterDto,
} from './dto/filters/discover-influencers-filter.dto';
import { InfluencersFilterDto } from './dto/filters/influencers-filter.dto';
import {
  DiseaseAreaTableResponseEntity,
  EthnicityTableResponseEntity,
  InfluencerTableResponseEntity,
  LabelTableResponseEntity,
  LocationTableResponseEntity,
  UserTableResponseEntity,
} from './entities/influencer-table-response.entity';
import { addDays, differenceInYears } from 'date-fns';
import { PostType } from './subroutes/desired-income/campaign/enums/post-type.enum';
import { SurveyType } from '../surveys/enums/survey-type.enum';
import { getPaginatedResults } from 'src/utils/prisma/get-paginated-result.util';
import { DeleteManyInfluencersDto } from './dto/delete-many-influencers.dto';
import { FindByIdsDto } from '../finance/dto/find-by-ids.dto';
import { Gender } from '../users/enums/gender';
import { NotificationsService } from '../notifications/notifications.service';
import { Language } from '../platform-product/enums/language.enum';
import { ProductOrderInfluencerStatus } from '../platform-product/enums/product-order-influencer-status.enum';
import { FilterSearchInfluencersDto } from './dto/filters/filter-search-influencers.dto';

@Injectable()
export class InfluencerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly instagramService: InstagramService,
    private readonly stakeholderService: StakeholdersService,
    private readonly notificationService: NotificationsService,
  ) {}

  static queryInclude: Prisma.UserInclude = {
    influencer: {
      include: {
        invitedByUser: true,
        influencerSurveyAmounts: true,
        influencerCampaignAmounts: true,
        influencerDiseaseAreas: {
          include: {
            diseaseArea: true,
          },
        },
        platformProductOrderInfluencers: true,
        stakeholders: true,
      },
    },
    location: { include: { country: true } },
    assigneeUserLabels: true,
    notificationUsers: {
      include: { notification: { include: { notificationPayload: true } } },
    },
    productOrderChatRoomMember: { include: { productOrderChatRoom: true } },
  };

  async affiliateCodeOwner(affiliateCode: string) {
    return await this.prismaService.influencer.findFirstOrThrow({
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

  async register(
    dto: InfluencerRegistrationDto,
    options?: { language: string },
  ) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        commonLegalId,
        patientSpecificLegalId,
      } = dto;

      // check if legals are in place
      // const commonLegalLast = await this.prismaService.legal.findFirstOrThrow({
      //   where: { type: Legal.Common },
      //   orderBy: { createdAt: 'desc' },
      // });
      // const patientSpecificLegalLast =
      //   await this.prismaService.legal.findFirstOrThrow({
      //     where: { type: Legal.PatientSpecific },
      //     orderBy: { createdAt: 'desc' },
      //   });

      /* if (commonLegalLast.id !== commonLegalId) {
        throw new BadRequestException(
          `Legal (${Legal.Common}) is not the newest`,
        );
      } else if (patientSpecificLegalLast.id !== patientSpecificLegalId) {
        throw new BadRequestException(
          `Legal (${Legal.Common}) is not the newest`,
        );
      } */

      const user = await this.prismaService.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: await Hash(password),
          role: UserRole.Influencer,
          status: UserStatus.Unconfirmed,
          influencer: {
            create: {
              affiliateCode: generateAffiliateCode(),
            },
          },
          legalConsents: {
            createMany: {
              data: [
                {
                  legalId: commonLegalId,
                },
                {
                  legalId: patientSpecificLegalId,
                },
              ],
            },
          },
        },
        include: {
          influencer: true,
        },
      });

      if (user) {
        await this.notificationService.welcomeUserAfterRegistration(user.id);
        await this.notificationService.influencerRegistered(
          user.id,
          `${user.firstName} ${user.lastName}`,
        );
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
      throwIfEmailExists(error);
      throw error;
    }
  }

  async registerViaInvitation(dto: InfluencerRegistrationViaInvitationDto) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        commonLegalId,
        patientSpecificLegalId,
        affiliateCode,
      } = dto;

      // check if legals are in place
      // const commonLegalLast = await this.prismaService.legal.findFirstOrThrow({
      //   where: { type: Legal.Common },
      //   orderBy: { createdAt: 'desc' },
      // });
      // const patientSpecificLegalLast =
      //   await this.prismaService.legal.findFirstOrThrow({
      //     where: { type: Legal.PatientSpecific },
      //     orderBy: { createdAt: 'desc' },
      //   });

      /* if (commonLegalLast.id !== commonLegalId) {
        throw new BadRequestException(
          `Legal (${Legal.Common}) is not the newest`,
        );
      } else if (patientSpecificLegalLast.id !== patientSpecificLegalId) {
        throw new BadRequestException(
          `Legal (${Legal.Common}) is not the newest`,
        );
      } */

      const [referrent, user] = await this.prismaService.$transaction(
        async (tx) => {
          const referredInfluencer = await tx.influencer.findFirstOrThrow({
            where: { affiliateCode: affiliateCode },
            include: {
              user: true,
            },
          });

          const createdUser = await tx.user.create({
            data: {
              email,
              firstName,
              lastName,
              password: await Hash(password),
              role: UserRole.Influencer,
              status: UserStatus.Unconfirmed,
              influencer: {
                create: {
                  // ! referredInfluencer can be undefined if affiliateCode is from ambassador
                  invitendByUserId: referredInfluencer?.user?.id,
                  affiliateCode: generateAffiliateCode(),
                },
              },
              legalConsents: {
                createMany: {
                  data: [
                    {
                      legalId: commonLegalId,
                    },
                    {
                      legalId: patientSpecificLegalId,
                    },
                  ],
                },
              },
            },
            include: {
              influencer: true,
            },
          });

          return [referredInfluencer, createdUser];
        },
      );

      if (user) {
        await this.notificationService.welcomeUserAfterRegistration(user.id);
        await this.notificationService.influencerRegistered(
          user.id,
          `${user.firstName} ${user.lastName}`,
        );
      }

      await this.mailService.sendConfirmationEmail(
        user.id,
        user.email,
        user.role,
        user.firstName,
      );

      return user;
    } catch (error) {
      throwIfEmailExists(error);
      throw error;
    }
  }

  async findOne(
    id: number,
    includeDetailedInfo = true,
    includeAffiliates = false,
  ) {
    try {
      const queryInclude: Prisma.UserInclude = {
        ...InfluencerService.queryInclude,
        invitedInfluencers: includeAffiliates
          ? { include: { user: true } }
          : undefined,
      };

      const influencer = await this.prismaService.user.findFirstOrThrow({
        where: { id, isDeleted: false, role: UserRole.Influencer },
        include: queryInclude,
      });

      return influencer;
    } catch (error) {
      // * can throw PrismaClientKnownRequestError P2025
      if (error instanceof Prisma.NotFoundError) {
        throw new InfluencerNotFoundException({ id });
      }
      throw error;
    }
  }

  async findAllInfluencers(
    { skip, take, sortBy, search }: FilterParamsObjectDefDto,
    filterSearchInfluencerCase: FilterSearchInfluencersDto,
  ): Promise<PaginationResult<User>> {
    const queryWhere: Prisma.UserWhereInput = {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        {
          AND: [
            {
              firstName: {
                contains: search.split(' ')[0], // Search for the first part of the full name
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: search.split(' ')[1], // Search for the second part of the full name
                mode: 'insensitive',
              },
            },
          ],
        },
      ],
      role: UserRole.Influencer,
      transactionFlow:
        filterSearchInfluencerCase.filterCase === 'finance'
          ? {
              some: {},
            }
          : undefined,
    };
    const queryInclude: Prisma.UserInclude = {
      influencer: true,
    };
    const queryOrderBy: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput> =
      (sortBy as any) || { firstName: 'asc' };

    try {
      const result = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.user,
        {
          where: queryWhere,
          skip,
          take,
          include: queryInclude,
          orderBy: queryOrderBy,
        },
      )();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async filterDiscoverInfluencers(
    { skip, take }: PaginationParamsDto,
    filters: DiscoverInfluencersFilterDto,
  ) {
    const userStatuses = [];
    if (
      filters.status !== undefined &&
      filters.stage === DiscoverInfluencerStage.Registered
    )
      userStatuses.push(filters.status);
    if (
      filters.stage === DiscoverInfluencerStage.Registered &&
      filters.status === undefined
    )
      userStatuses.push(UserStatus.Unconfirmed, UserStatus.Confirmed);
    else if (
      filters.stage === DiscoverInfluencerStage.ToBeApproved &&
      filters.status === undefined
    )
      userStatuses.push(UserStatus.ToBeApproved);

    const userFilterQuery: Prisma.UserWhereInput = {
      status: userStatuses.length ? { in: userStatuses } : undefined,
      isDeleted: false,
      location:
        filters.locationIds && filters.locationIds.length
          ? {
              OR: [
                {
                  id: filters.locationIds?.length
                    ? { in: filters.locationIds }
                    : undefined,
                },
                {
                  countryId: filters.locationIds?.length
                    ? { in: filters.locationIds }
                    : undefined,
                },
              ],
            }
          : undefined,
      // location: {
      //   id: filters.locationIds?.length
      //     ? { in: filters.locationIds }
      //     : undefined,
      //   name: filters.search
      //     ? { contains: filters.search, mode: 'insensitive' }
      //     : undefined,
      // },
      // assigneeUserLabels: {
      //   ...(filters.hasLabel === true && { some: {} }),
      //   ...(filters.hasLabel === false && { none: {} }),
      //   ...(filters.labelIds?.length
      //     ? { some: { labelId: { in: filters.labelIds } } }
      //     : undefined),
      // },
      // calendarEventAttendees: {
      //   ...(filters.hasSchedule === true && { some: {} }),
      //   ...(filters.hasSchedule === false && { none: {} }),
      //   ...(filters.scheduleIds?.length
      //     ? {
      //         some: {
      //           calendarEvent: { eventType: { in: filters.scheduleIds } },
      //         },
      //       }
      //     : undefined),
      // },
      createdAt: (filters.joinedFrom || filters.joinedTo) && {
        gte: filters.joinedFrom,
        lte: filters.joinedTo,
      },
    };
    const { minDOB, maxDOB } = calculateDOB(filters.ageMin, filters.ageMax);
    const influencerFilterQuery: Prisma.InfluencerWhereInput = {
      OR: [
        // {
        //   user: {
        //     firstName: {
        //       contains: filters.search,
        //       mode: 'insensitive',
        //     },
        //   },
        // },
        // {
        //   user: {
        //     lastName: {
        //       contains: filters.search,
        //       mode: 'insensitive',
        //     },
        //   },
        // },
        // {
        //   user: {
        //     email: {
        //       contains: filters.search,
        //       mode: 'insensitive',
        //     },
        //   },
        // },
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
            ],
          },
        },
      ],
      type: filters.experienceAs,
      // ethnicityId: filters.ethnicityId,
      influencerDiseaseAreas: filters.diseaseAreaIds?.length
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
      AND:
        minDOB || maxDOB || filters.gender || filters.gender === 0
          ? [
              {
                // prioritize data that influencer has entered
                OR: [
                  {
                    dateOfBirth: {
                      gte: minDOB,
                      lte: maxDOB,
                    },
                  },
                  /* {
              stakeholders: (minDOB || maxDOB) && {
                some: {
                  dateOfBirth: {
                    gte: minDOB,
                    lte: maxDOB,
                  },
                },
              },
            }, */
                ],
              },
              {
                // if infleuncer didn't enter a data, take it from ML
                OR: [
                  {
                    gender: filters.gender,
                  },
                  /* {
              stakeholders: filters.gender && {
                some: {
                  gender: filters.gender,
                },
              },
            }, */
                ],
              },
            ]
          : undefined,
    };
    const stakeholderFilterQuery: Prisma.StakeholderWhereInput = {
      patientCaregiverDiseaseAreas: filters.diseaseAreaIds?.length
        ? {
            some: {
              diseaseAreaId: {
                in: filters.diseaseAreaIds,
              },
            },
          }
        : undefined,
      // dateOfBirth: {
      //   gte: minDOB,
      //   lte: maxDOB,
      // },
      // gender: filters.gender,
      socialPlatformId: filters.socialMediaId
        ? { in: filters.socialMediaId }
        : undefined,
      // socialPlatformUsername: filters.search
      //   ? { contains: filters.search }
      //   : undefined,
    };

    const influencers =
      await getPaginatedResults<Prisma.InfluencerFindManyArgs>(
        this.prismaService,
        Prisma.ModelName.Influencer,
        {
          where: {
            ...influencerFilterQuery,
            user: {
              ...userFilterQuery,
            },
            // OR: [
            //   {
            //     stakeholders: {
            //       some: {
            //         ...stakeholderFilterQuery,
            //       },
            //     },
            //   },
            //   {
            //     stakeholders: {
            //       none: {},
            //     },
            //   },
            // ],
          },
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                status: true,
                currency: true,
                createdAt: true,
                updatedAt: true,
                assigneeUserLabels: {
                  select: {
                    label: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
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
            invitedByUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            gender: true,
            dateOfBirth: true,
            influencerCampaignAmounts: {
              select: {
                _count: true,
                desiredAmount: true,
                postType: true,
              },
            },
            influencerSurveyAmounts: {
              select: {
                _count: true,
                desiredAmount: true,
                surveyType: true,
              },
            },
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
            stakeholders: {
              select: {
                patientCaregiverDiseaseAreas: {
                  select: {
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
                gender: true,
                age: true,
                socialPlatform: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        { skip, limit: take },
      );

    const mappedInfluencers = influencers.data.map((influencer) => {
      return {
        id: influencer.user.id,
        ...influencer,
      };
    });

    return { data: mappedInfluencers, pagination: influencers.pagination };
  }

  mapLanguageCodeToEnum(languageCode: string): Language | undefined {
    switch (languageCode) {
      case 'en':
        return Language.English;
      case 'fr':
        return Language.French;
      case 'de':
        return Language.German;
      case 'es':
        return Language.Spanish;
      case 'it':
        return Language.Italian;
      // Add more cases for other languages
      default:
        return Language.Other; // Return undefined for unknown languages
    }
  }

  getLast5PercentPosts(posts) {
    // Calculate the number of posts for 5%
    if (posts.length <= 5) {
      return posts;
    }
    const fivePercent = Math.ceil((5 / 100) * posts.length);

    // Ensure there's at least 1 post
    const minPosts = Math.max(fivePercent, 5);

    // Extract the last 5% (or minimum 1 post)
    const lastPosts = posts.slice(-minPosts);

    return lastPosts;
  }

  clampValue(value: number) {
    // Ensure the value is at least 0
    value = Math.max(0, value);

    // Ensure the value is at most 100
    value = Math.min(100, value);

    // Return the clamped value
    return value;
  }

  calculateFollowerOverlap(user1, user2) {
    const commonFollowers = user1.stakeholders.filter((stakeholder) => {
      const stakeholderTwoIds = user2.stakeholders.map(
        (stakeholderTwo) => stakeholderTwo.socialPlatformUserId,
      );
      return stakeholderTwoIds.includes(stakeholder.socialPlatformUserId);
    });

    const overlapPercentage = commonFollowers?.length
      ? (commonFollowers.length / user1.stakeholders.length) * 100
      : 0;

    return overlapPercentage;
  }

  async filterInfluencers(
    { skip, take }: PaginationParamsDto,
    filters: InfluencersFilterDto,
  ) {
    const userFilterQuery: Prisma.UserWhereInput = {
      status: UserStatus.Approved,
      isDeleted: false,

      location:
        filters.locationIds && filters.locationIds.length
          ? {
              OR: [
                {
                  id: filters.locationIds?.length
                    ? { in: filters.locationIds }
                    : undefined,
                },
                {
                  countryId: filters.locationIds?.length
                    ? { in: filters.locationIds }
                    : undefined,
                },
              ],
            }
          : undefined,
      // assigneeUserLabels: {
      //   ...(filters.hasLabel === true && { some: {} }),
      //   ...(filters.hasLabel === false && { none: {} }),
      //   ...(filters.labelIds?.length
      //     ? { some: { labelId: { in: filters.labelIds } } }
      //     : undefined),
      // },
      // calendarEventAttendees: {
      //   ...(filters.hasSchedule === true && { some: {} }),
      //   ...(filters.hasSchedule === false && { none: {} }),
      //   ...(filters.scheduleIds?.length
      //     ? {
      //         some: {
      //           calendarEvent: { eventType: { in: filters.scheduleIds } },
      //         },
      //       }
      //     : undefined),
      // },
      createdAt: (filters.joinedFrom || filters.joinedTo) && {
        gte: filters.joinedFrom,
        lte: filters.joinedTo,
      },
    };
    const { minDOB, maxDOB } = calculateDOB(filters.ageMin, filters.ageMax);
    const influencerFilterQuery: Prisma.InfluencerWhereInput = {
      type: filters.experienceAsId,
      ethnicityId: {
        in: filters.ethnicityIds,
      },
      //#region should be in selected by influencer-entered data, then by scraped social platform data
      dateOfBirth: (minDOB || maxDOB) && {
        gte: minDOB,
        lte: maxDOB,
      },
      gender: {
        in: filters.genderIds,
      },
      //#endregion
      // OR: [
      //   // * prioritize data that influencer has entered
      //   // take a data that influencer has entered
      //   {
      //     dateOfBirth: (minDOB || maxDOB) && {
      //       gte: minDOB,
      //       lte: maxDOB,
      //     },
      //     gender: filters.gender,
      //   },
      //   // TODO uncomment when non-bugged solution is found
      //   /* // from influencer, try to take DoB
      //   {
      //     dateOfBirth: (minDOB || maxDOB) && {
      //       gte: minDOB,
      //       lte: maxDOB,
      //     },
      //     stakeholders: filters.gender && {
      //       some: {
      //         gender: filters.gender,
      //       },
      //     },
      //   },
      //   // from influencer, try to take gender
      //   {
      //     stakeholders: (minDOB || maxDOB) && {
      //       some: {
      //         dateOfBirth: {
      //           gte: minDOB,
      //           lte: maxDOB,
      //         },
      //       },
      //     },
      //     gender: filters.gender,
      //   },
      //   // as influencer did not entered DoB nor gender, see his social platforms (scraped)
      //   {
      //     stakeholders: (minDOB || maxDOB || filters.gender) && {
      //       some: {
      //         dateOfBirth: (minDOB || maxDOB) && {
      //           gte: minDOB,
      //           lte: maxDOB,
      //         },
      //         gender: filters.gender,
      //       },
      //     },
      //   }, */
      // ],
    };

    const stakeholderFilterQuery: Prisma.StakeholderWhereInput = {
      patientCaregiverDiseaseAreas: filters.diseaseAreaIds?.length
        ? { some: { diseaseAreaId: { in: filters.diseaseAreaIds } } }
        : undefined,
      // dateOfBirth: {
      //   gte: minDOB,
      //   lte: maxDOB,
      // },
      // gender: filters.gender,
      // socialPlatformId:
      //   filters.socialMediaId !== undefined
      //     ? { in: filters.socialMediaId }
      //     : undefined,
      followersCount: (filters.followersMin || filters.followersMax) && {
        gte: filters.followersMin,
        lte: filters.followersMax,
      },
    };
    const isAnyStakeholderFilterActive =
      filters.diseaseAreaIds?.length ||
      // filters.socialMediaId !== undefined ||
      filters.followersMin !== undefined ||
      filters.followersMax !== undefined;
    // influencerSearchFilterQuery
    /* const influencerSearchFilterQuery: Prisma.InfluencerWhereInput = {
      OR: filters.search
        ? [
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
                    lastName: { contains: filters.search, mode: 'insensitive' },
                  },
                  {
                    email: { contains: filters.search, mode: 'insensitive' },
                  },
                  {
                    location: {
                      name: { contains: filters.search, mode: 'insensitive' },
                    },
                  },
                ],
              },
            },
            {
              stakeholders: {
                some: {
                  socialPlatformUsername: filters.search
                    ? { contains: filters.search, mode: 'insensitive' }
                    : undefined,
                },
              },
            },
          ]
        : undefined,
    }; */
    const whereQuery: Prisma.InfluencerWhereInput = {
      OR: filters.search
        ? [
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
                    lastName: { contains: filters.search, mode: 'insensitive' },
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
                ],
                ...userFilterQuery,
              },
              OR: [
                // if stakeholders: { some: { ... } } is not true, result is positive only
                // if stakeholders { none: {} } is true with condition stakeholder filter is off
                {
                  stakeholders: {
                    some: {
                      ...stakeholderFilterQuery,
                    },
                  },
                },
                {
                  stakeholders: !isAnyStakeholderFilterActive
                    ? {
                        none: {},
                      }
                    : undefined,
                },
              ],
              ...influencerFilterQuery,
            },
            {
              stakeholders: {
                some: {
                  socialPlatformUsername: filters.search
                    ? { contains: filters.search, mode: 'insensitive' }
                    : undefined,
                  ...stakeholderFilterQuery,
                },
              },
              user: {
                ...userFilterQuery,
              },
              ...influencerFilterQuery,
            },
          ]
        : undefined,
      ...(!filters.search && {
        ...influencerFilterQuery,
        user: {
          ...userFilterQuery,
        },
        OR: [
          // if stakeholders: { some: { ... } } is not true, result is positive only
          // if stakeholders { none: {} } is true with condition stakeholder filter is off
          {
            stakeholders: {
              some: {
                ...stakeholderFilterQuery,
              },
            },
          },
          {
            stakeholders: !isAnyStakeholderFilterActive
              ? {
                  none: {},
                }
              : undefined,
          },
        ],
      }),
    };

    const influencersWithFollowers =
      await this.prismaService.influencer.findMany({
        where: {
          ...whereQuery,
        },
        include: {
          influencerCampaignAmounts: true,
          influencerSurveyAmounts: true,
          platformProductOrderInfluencers: true,
          user: {
            select: {
              transactionFlow: true,
            },
          },
          stakeholders: {
            include: {
              campaignLikers: true,
              patientCaregiverDiseaseAreas: true,
              location: {
                include: {
                  country: true,
                },
              },
              stakeholderPosts: {
                include: {
                  postDiseaseAreas: true,
                  postStruggles: true,
                },
              },
              stakeholderInterests: true,
              _count: true,
            },
          },
        },
      });

    const influencersFormattedFromInfluencer = influencersWithFollowers
      .map((influencer) => {
        return {
          ...influencer,
          costPerTarget: null,
          costPerLike: null,
          costPerComment: null,
          costPerEngagement: null,
          postDesiredAmount: null,
          reelDesiredAmount: null,
          storyDesiredAmount: null,
          questionCreditDesiredAmount: null,
          influencerFromApp:
            influencer.stakeholders.length &&
            influencer.instagramUsername &&
            influencer.instagramUsername.length
              ? influencer.stakeholders.find(
                  (stakeholder) =>
                    influencer.instagramUsername.trim() ===
                    stakeholder.socialPlatformUsername,
                )
              : undefined,
          stakeholders:
            influencer.stakeholders.length &&
            influencer.instagramUsername &&
            influencer.instagramUsername.length
              ? influencer.stakeholders.filter(
                  (stakeholder) =>
                    influencer.instagramUsername.trim() !==
                    stakeholder.socialPlatformUsername,
                )
              : [],
        };
      })
      .map((filteredInfluencer) => {
        const postDesiredAmount =
          filteredInfluencer.influencerCampaignAmounts.find(
            (campaignAmount) => campaignAmount.postType === PostType.Post,
          )?.desiredAmount || null;

        const reelDesiredAmount =
          filteredInfluencer.influencerCampaignAmounts.find(
            (campaignAmount) => campaignAmount.postType === PostType.Reel,
          )?.desiredAmount || null;

        const storyDesiredAmount =
          filteredInfluencer.influencerCampaignAmounts.find(
            (campaignAmount) => campaignAmount.postType === PostType.Story,
          )?.desiredAmount || null;

        const questionCreditAmount =
          filteredInfluencer.influencerSurveyAmounts.find(
            (surveyAmount) =>
              surveyAmount.surveyType === SurveyType.Questionnaire,
          )?.desiredAmount || null;

        if (filteredInfluencer?.influencerFromApp) {
          const followerCount = filteredInfluencer.influencerFromApp
            ?.followersCount
            ? filteredInfluencer.influencerFromApp.followersCount
            : 0;

          const costPerPostTargetFn = (postType: PostType) => {
            let result: number = null;

            switch (postType) {
              case PostType.Post:
                result = postDesiredAmount
                  ? +postDesiredAmount / followerCount
                  : null;
                break;
              case PostType.Reel:
                result = reelDesiredAmount
                  ? +reelDesiredAmount / followerCount
                  : null;
                break;

              case PostType.Story:
                result = storyDesiredAmount
                  ? +storyDesiredAmount / followerCount
                  : null;
                break;

              default:
                result = null;
            }
            return result;
          };

          const costPerSurveyTargetFn = () => {
            return questionCreditAmount
              ? questionCreditAmount.toNumber() / followerCount
              : null;
          };
          const costPerTarget =
            filters.performancePostTypeId === 0 || filters.performancePostTypeId
              ? costPerPostTargetFn(filters.performancePostTypeId)
              : null;
          const costPerQuestionCredit = costPerSurveyTargetFn();

          return {
            ...filteredInfluencer,
            postDesiredAmount,
            reelDesiredAmount,
            storyDesiredAmount,
            questionCreditAmount,
            costPerTarget,
            costPerQuestionCredit,
          };
        }

        return {
          ...filteredInfluencer,
          postDesiredAmount,
          reelDesiredAmount,
          storyDesiredAmount,
          questionCreditAmount,
        };
      })
      .filter((influencer) => {
        let isMatch = true;

        let influencerStakeholders = influencer.stakeholders.length
          ? influencer.stakeholders
          : [];

        if (filters.languageIds?.length) {
          const influencerLanguages =
            influencer.influencerFromApp &&
            influencer.influencerFromApp.stakeholderPosts
              ? influencer.influencerFromApp.stakeholderPosts.map((posts) =>
                  this.mapLanguageCodeToEnum(posts.language),
                )
              : [];
          isMatch &&= filters.languageIds.some((filteredLanguage) =>
            influencerLanguages.includes(filteredLanguage),
          );
        }

        if (filters.followersMin !== undefined) {
          isMatch &&=
            influencer.influencerFromApp.followersCount >= filters.followersMin;
        }

        if (filters.followersMax !== undefined) {
          isMatch &&=
            influencer.influencerFromApp.followersCount <= filters.followersMax;
        }

        if (
          filters.engagementMin !== undefined ||
          filters.engagementMax !== undefined
        ) {
          if (
            !influencer.influencerFromApp ||
            !influencer.influencerFromApp.stakeholderPosts
          ) {
            isMatch = false;
          } else {
            const lastFivePercentOfPosts = this.getLast5PercentPosts(
              influencer.influencerFromApp.stakeholderPosts,
            );

            const postLikes = lastFivePercentOfPosts
              .map((post) => post.likes)
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              );
            const postComments = lastFivePercentOfPosts
              .map((post) => post.comments)
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              );
            const engagementValue = influencer.influencerFromApp.followersCount
              ? postLikes +
                postComments / influencer.influencerFromApp.followersCount
              : 0;

            influencer.costPerEngagement = engagementValue;

            if (filters.engagementMin !== undefined) {
              isMatch &&= engagementValue >= filters.engagementMin;
            }

            if (filters.engagementMax !== undefined) {
              isMatch &&= engagementValue <= filters.engagementMax;
            }
          }
        }

        if (filters.likesMin !== undefined || filters.likesMax !== undefined) {
          if (
            !influencer.influencerFromApp ||
            !influencer.influencerFromApp.stakeholderPosts
          ) {
            isMatch = false;
          } else {
            const lastFivePercentOfPosts = this.getLast5PercentPosts(
              influencer.influencerFromApp.stakeholderPosts,
            );
            const postNumber = lastFivePercentOfPosts.length;
            const postLikes = lastFivePercentOfPosts
              .map((post) => post.likes)
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              );

            const postLikeAverage =
              postNumber !== 0 ? postLikes / postNumber : 0;
            if (filters.likesMin !== undefined) {
              isMatch &&= postLikeAverage >= filters.likesMin;
            }

            if (filters.likesMax !== undefined) {
              isMatch &&= postLikeAverage <= filters.likesMax;
            }
          }
        }

        if (filters.struggleIds?.length) {
          if (
            !influencer.influencerFromApp ||
            !influencer.influencerFromApp.stakeholderPosts
          ) {
            isMatch = false;
          } else {
            const lastFivePercentOfPosts: (StakeholderPost & {
              postDiseaseAreas: PostDiseaseArea[];
              postStruggles: PostStruggle[];
            })[] = this.getLast5PercentPosts(
              influencer.influencerFromApp.stakeholderPosts,
            );
            const postStrugglesIds = lastFivePercentOfPosts.map((posts) => {
              const postStrugglesIds = posts.postStruggles.map(
                (struggle) => struggle.struggleId,
              );
              return postStrugglesIds;
            });

            const flattenedArray = postStrugglesIds.flatMap((arr) => arr);

            const uniqueValues = [...new Set(flattenedArray)];

            isMatch &&= filters.struggleIds.some((struggleId) =>
              uniqueValues.includes(struggleId),
            );
          }
        }

        if (
          filters.commentsMin !== undefined ||
          filters.commentsMax !== undefined
        ) {
          if (
            !influencer.influencerFromApp ||
            !influencer.influencerFromApp.stakeholderPosts
          ) {
            isMatch = false;
          } else {
            const lastFivePercentOfPosts = this.getLast5PercentPosts(
              influencer.influencerFromApp.stakeholderPosts,
            );
            const postNumber = lastFivePercentOfPosts.length;
            const postComments = lastFivePercentOfPosts
              .map((post) => post.comments)
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              );

            const postCommentAverage =
              postNumber !== 0 ? postComments / postNumber : 0;
            if (filters.commentsMin !== undefined) {
              isMatch &&= postCommentAverage >= filters.commentsMin;
            }

            if (filters.commentsMax !== undefined) {
              isMatch &&= postCommentAverage <= filters.commentsMax;
            }
          }
        }

        if (filters.keywords && filters.keywords.length) {
          const keywordArray = filters.keywords.split(' ');

          const matchingKeywords = [];

          for (const keyword of keywordArray) {
            if (influencer.influencerFromApp?.bio?.includes(keyword)) {
              matchingKeywords.push(keyword);
            }
          }

          isMatch &&= !!matchingKeywords.length;
        }

        if (filters.audienceKeywords && filters.audienceKeywords.length) {
          const keywordArray = filters.audienceKeywords.split(' ');

          const matchingKeywords = [];
          const influencerStakeholderBioArray = influencer.stakeholders.map(
            (stakeholder) => stakeholder.bio,
          );

          for (const bio of influencerStakeholderBioArray) {
            const bioMatchingKeywords = [];

            for (const keyword of keywordArray) {
              if (bio?.toLowerCase().includes(keyword.toLowerCase())) {
                bioMatchingKeywords.push(keyword);
              }
            }

            matchingKeywords.push(...bioMatchingKeywords);
          }

          isMatch &&= !!matchingKeywords.length;
        }

        if (filters?.stakeholderIds?.length && influencer.stakeholders) {
          const stakeholderTypeVals = influencer.stakeholders.map(
            (stakeholder) => stakeholder.type,
          );

          const targetedTypeStakeholders = influencer.stakeholders.filter(
            (stakeholder) => filters.stakeholderIds.includes(stakeholder.type),
          );

          influencerStakeholders = influencerStakeholders.filter(
            (stakeholder) => targetedTypeStakeholders.includes(stakeholder),
          );

          isMatch &&= !!filters.stakeholderIds.every((stakeholderId) =>
            stakeholderTypeVals.includes(stakeholderId),
          );
        }

        if (
          filters.audienceGenderChoiceIds &&
          filters.audienceGenderChoiceIds.length
        ) {
          if (
            filters.audienceGenderUnitId &&
            filters.audienceGenderUnitId === FilterUnit.Absolute
          ) {
            const filteredFollowersByGender = influencer.stakeholders.filter(
              (stakeholder) =>
                stakeholder.socialPlatformUsername &&
                filters.audienceGenderChoiceIds.includes(stakeholder.gender),
            );

            influencerStakeholders = influencerStakeholders.filter(
              (stakeholder) => filteredFollowersByGender.includes(stakeholder),
            );

            isMatch &&= filters.audienceGenderCount
              ? filteredFollowersByGender.length >= filters.audienceGenderCount
              : !!filteredFollowersByGender.length;
          }

          if (
            filters.audienceGenderUnitId &&
            filters.audienceGenderUnitId === FilterUnit.Relative
          ) {
            const filterAlenativePercentage = filters.audienceGenderCount
              ? this.clampValue(filters.audienceGenderCount)
              : 1;

            const totalFollowers = influencer.stakeholders.length;

            const targetedGenderStakeholders = influencer.stakeholders.filter(
              (stakeholder) =>
                filters.audienceGenderChoiceIds.includes(stakeholder.gender),
            );

            const totalNumberOfTargetedGender =
              targetedGenderStakeholders.length;

            influencerStakeholders = influencerStakeholders.filter(
              (stakeholder) => targetedGenderStakeholders.includes(stakeholder),
            );

            isMatch &&=
              totalFollowers &&
              (totalNumberOfTargetedGender / totalFollowers) * 100 >=
                filterAlenativePercentage;
          }
        }

        if (
          (filters.audienceAgeMin ||
            filters.audienceAgeMin === 0 ||
            filters.audienceAgeMax ||
            filters.audienceAgeMax === 0) &&
          (filters.audienceAgeCount === 0 || filters.audienceAgeCount) &&
          filters.audienceAgeUnitId
        ) {
          if (filters.audienceAgeUnitId === FilterUnit.Absolute) {
            if (filters.audienceAgeMin || filters.audienceAgeMin === 0) {
              const filteredStakeholdersMin = influencer.stakeholders.filter(
                (stakeholder) => stakeholder.age >= filters.audienceAgeMin,
              );

              influencerStakeholders = influencerStakeholders.filter(
                (stakeholder) => filteredStakeholdersMin.includes(stakeholder),
              );

              isMatch &&=
                filteredStakeholdersMin &&
                filteredStakeholdersMin.length >= filters.audienceAgeCount;
            }

            if (filters.audienceAgeMax || filters.audienceAgeMax === 0) {
              const filteredStakeholdersMax = influencer.stakeholders.filter(
                (stakeholder) =>
                  stakeholder.age && stakeholder.age <= filters.audienceAgeMax,
              );

              influencerStakeholders = influencerStakeholders.filter(
                (stakeholder) => filteredStakeholdersMax.includes(stakeholder),
              );

              isMatch &&=
                filteredStakeholdersMax &&
                filteredStakeholdersMax.length >= filters.audienceAgeCount;
            }
          }

          if (filters.audienceAgeUnitId === FilterUnit.Relative) {
            if (
              (filters.audienceAgeMax === undefined &&
                filters.audienceAgeMin) ||
              filters.audienceAgeMin === 0
            ) {
              const totalNumberOfStakeholders = influencer.stakeholders.length;

              const filteredStakeholdersMin = influencer.stakeholders.filter(
                (stakeholder) => stakeholder.age >= filters.audienceAgeMin,
              );

              influencerStakeholders = influencerStakeholders.filter(
                (stakeholder) => filteredStakeholdersMin.includes(stakeholder),
              );

              const minPercentageForGivenAge =
                (filteredStakeholdersMin.length / totalNumberOfStakeholders) *
                100;

              const filterAlenativePercentage = this.clampValue(
                filters.audienceAgeCount,
              );

              isMatch &&= minPercentageForGivenAge >= filterAlenativePercentage;
            }

            if (
              (filters.audienceAgeMin === undefined &&
                filters.audienceAgeMax) ||
              filters.audienceAgeMax === 0
            ) {
              const totalNumberOfStakeholders = influencer.stakeholders.length;

              const filteredStakeholdersMax = influencer.stakeholders.filter(
                (stakeholder) =>
                  stakeholder.age && stakeholder.age <= filters.audienceAgeMax,
              );

              influencerStakeholders = influencerStakeholders.filter(
                (stakeholder) => filteredStakeholdersMax.includes(stakeholder),
              );

              const maxPercentageForGivenAge =
                (filteredStakeholdersMax.length / totalNumberOfStakeholders) *
                100;

              const filterAlenativePercentage = this.clampValue(
                filters.audienceAgeCount,
              );

              isMatch &&= maxPercentageForGivenAge >= filterAlenativePercentage;
            }

            if (
              filters.audienceAgeMin !== undefined &&
              filters.audienceAgeMax !== undefined
            ) {
              const totalNumberOfStakeholders = influencer.stakeholders.length;

              const filteredStakeholdersMinMax = influencer.stakeholders.filter(
                (stakeholder) =>
                  stakeholder.age >= filters.audienceAgeMin &&
                  stakeholder.age <= filters.audienceAgeMax,
              );

              influencerStakeholders = influencerStakeholders.filter(
                (stakeholder) =>
                  filteredStakeholdersMinMax.includes(stakeholder),
              );

              const minMaxPercentageForGivenAge =
                (filteredStakeholdersMinMax.length /
                  totalNumberOfStakeholders) *
                100;

              const filterAlenativePercentage = this.clampValue(
                filters.audienceAgeCount,
              );

              isMatch &&=
                minMaxPercentageForGivenAge >= filterAlenativePercentage;
            }
          }
        }

        if (
          filters.audienceEthnicityChoiceIds &&
          filters.audienceEthnicityChoiceIds.length
        ) {
          if (
            filters.audienceEthnicityUnitId &&
            filters.audienceEthnicityUnitId === FilterUnit.Absolute
          ) {
            const filteredFollowersByEthnicity = influencer.stakeholders.filter(
              (stakeholder) =>
                stakeholder.socialPlatformUsername &&
                filters.audienceEthnicityChoiceIds.includes(
                  stakeholder.ethnicityId,
                ),
            );

            influencerStakeholders = influencerStakeholders.filter(
              (stakeholder) =>
                filteredFollowersByEthnicity.includes(stakeholder),
            );

            isMatch &&= filters.audienceEthnicityCount
              ? filteredFollowersByEthnicity.length >=
                filters.audienceEthnicityCount
              : !!filteredFollowersByEthnicity.length;
          }

          if (
            filters.audienceEthnicityUnitId &&
            filters.audienceEthnicityUnitId === FilterUnit.Relative
          ) {
            const filterAlenativePercentage = filters.audienceEthnicityCount
              ? this.clampValue(filters.audienceEthnicityCount)
              : 1;

            const totalFollowers = influencer.stakeholders.length;

            const totalTargetedEthnicity = influencer.stakeholders.filter(
              (stakeholder) =>
                filters.audienceEthnicityChoiceIds.includes(
                  stakeholder.ethnicityId,
                ),
            );

            //

            influencerStakeholders = influencerStakeholders.filter(
              (stakeholder) => totalTargetedEthnicity.includes(stakeholder),
            );

            isMatch &&=
              totalFollowers &&
              (totalTargetedEthnicity.length / totalFollowers) * 100 >=
                filterAlenativePercentage;
          }
        }

        if (
          filters.audienceLocationChoiceIds &&
          filters.audienceLocationChoiceIds.length
        ) {
          if (
            filters.audienceLocationUnitId &&
            filters.audienceLocationUnitId === FilterUnit.Absolute
          ) {
            const filteredFollowersByLocation = influencer.stakeholders.filter(
              (stakeholder) =>
                stakeholder.socialPlatformUsername &&
                (filters.audienceLocationChoiceIds.includes(
                  stakeholder.locationId,
                ) ||
                  (stakeholder?.location?.countryId &&
                    filters.audienceLocationChoiceIds.includes(
                      stakeholder.location.countryId,
                    ))),
            );

            influencerStakeholders = influencerStakeholders.filter(
              (stakeholder) =>
                filteredFollowersByLocation.includes(stakeholder),
            );

            isMatch &&= filters.audienceLocationCount
              ? filteredFollowersByLocation.length >=
                filters.audienceLocationCount
              : !!filteredFollowersByLocation.length;
          }

          if (
            filters.audienceLocationUnitId &&
            filters.audienceLocationUnitId === FilterUnit.Relative
          ) {
            const filterAlenativePercentage = filters.audienceLocationCount
              ? this.clampValue(filters.audienceLocationCount)
              : 1;

            const totalFollowers = influencer.stakeholders.length;

            const filteredFollowersOfTargetLocation =
              influencer.stakeholders.filter(
                (stakeholder) =>
                  stakeholder.socialPlatformUsername &&
                  (filters.audienceLocationChoiceIds.includes(
                    stakeholder.locationId,
                  ) ||
                    (stakeholder?.location?.countryId &&
                      filters.audienceLocationChoiceIds.includes(
                        stakeholder.location.countryId,
                      ))),
              );

            const totalNumberOfTargetedLocation =
              filteredFollowersOfTargetLocation.length;

            influencerStakeholders = influencerStakeholders.filter(
              (stakeholder) =>
                filteredFollowersOfTargetLocation.includes(stakeholder),
            );

            isMatch &&=
              totalFollowers &&
              (totalNumberOfTargetedLocation / totalFollowers) * 100 >=
                filterAlenativePercentage;
          }
        }

        if (
          filters.audienceDiseaseAreaChoiceIds &&
          filters.audienceDiseaseAreaChoiceIds.length
        ) {
          if (
            filters.audienceDiseaseAreaUnitId &&
            filters.audienceDiseaseAreaUnitId === FilterUnit.Absolute
          ) {
            const filteredFollowersByDiseaseArea =
              influencer.stakeholders.filter(
                (stakeholder) =>
                  stakeholder.socialPlatformUsername &&
                  filters.audienceDiseaseAreaChoiceIds.some((diseaseId) => {
                    const diseaseAreaIds = stakeholder.stakeholderPosts.map(
                      (stakeholderPost) => {
                        const postDiseaseaAreaIds =
                          stakeholderPost.postDiseaseAreas.map(
                            (disease) => disease.diseaseAreaId,
                          );
                        return postDiseaseaAreaIds;
                      },
                    );

                    const flattenedArray = diseaseAreaIds.flatMap((arr) => arr);
                    const uniqueValues = [...new Set(flattenedArray)];

                    return uniqueValues.includes(diseaseId);
                  }),
              );

            influencerStakeholders = influencerStakeholders.filter(
              (stakeholder) =>
                filteredFollowersByDiseaseArea.includes(stakeholder),
            );

            isMatch &&= filters.audienceDiseaseAreaCount
              ? filteredFollowersByDiseaseArea.length >=
                filters.audienceDiseaseAreaCount
              : !!filteredFollowersByDiseaseArea.length;
          }

          if (
            filters.audienceDiseaseAreaUnitId &&
            filters.audienceDiseaseAreaUnitId === FilterUnit.Relative
          ) {
            const filterAlenativePercentage = filters.audienceDiseaseAreaCount
              ? this.clampValue(filters.audienceDiseaseAreaCount)
              : 1;

            const totalFollowers = influencer.stakeholders.length;

            const filteredFollowersByDiseaseArea =
              influencer.stakeholders.filter(
                (stakeholder) =>
                  stakeholder.socialPlatformUsername &&
                  filters.audienceDiseaseAreaChoiceIds.some((diseaseId) => {
                    const diseaseAreaIds = stakeholder.stakeholderPosts.map(
                      (stakeholderPost) => {
                        const postDiseaseaAreaIds =
                          stakeholderPost.postDiseaseAreas.map(
                            (disease) => disease.diseaseAreaId,
                          );
                        return postDiseaseaAreaIds;
                      },
                    );

                    const flattenedArray = diseaseAreaIds.flatMap((arr) => arr);
                    const uniqueValues = [...new Set(flattenedArray)];

                    return uniqueValues.includes(diseaseId);
                  }),
              );

            const filteredFollowersByDiseaseAreaNumber =
              filteredFollowersByDiseaseArea.length;

            influencerStakeholders = influencerStakeholders.filter(
              (stakeholder) =>
                filteredFollowersByDiseaseArea.includes(stakeholder),
            );

            isMatch &&=
              totalFollowers &&
              (filteredFollowersByDiseaseAreaNumber / totalFollowers) * 100 >=
                filterAlenativePercentage;
          }
        }

        if (filters.audienceStruggleChoiceIds?.length) {
          if (!influencer.stakeholders.length) {
            isMatch = false;
          } else {
            if (
              filters.audienceStruggleUnitId &&
              filters.audienceStruggleUnitId === FilterUnit.Absolute
            ) {
              const filteredFollowersByStruggle =
                influencer.stakeholders.filter(
                  (stakeholder) =>
                    stakeholder.socialPlatformUsername &&
                    // not sure if every or some should be used when having multi select
                    filters.audienceStruggleChoiceIds.every((struggleId) => {
                      const struggleAreaIds = stakeholder.stakeholderPosts.map(
                        (stakeholderPost) => {
                          const postStruggleIds =
                            stakeholderPost.postStruggles.map(
                              (struggle) => struggle.struggleId,
                            );
                          return postStruggleIds;
                        },
                      );

                      const flattenedArray = struggleAreaIds.flatMap(
                        (arr) => arr,
                      );
                      const uniqueValues = [...new Set(flattenedArray)];

                      return uniqueValues.includes(struggleId);
                    }),
                );

              influencerStakeholders = influencerStakeholders.filter(
                (stakeholder) =>
                  filteredFollowersByStruggle.includes(stakeholder),
              );

              isMatch &&= filters.audienceStruggleCount
                ? filteredFollowersByStruggle.length >=
                  filters.audienceStruggleCount
                : !!filteredFollowersByStruggle.length;
            }

            if (
              filters.audienceStruggleUnitId &&
              filters.audienceStruggleUnitId === FilterUnit.Relative
            ) {
              const filterAlenativePercentage = filters.audienceStruggleCount
                ? this.clampValue(filters.audienceStruggleCount)
                : 1;

              const totalFollowers = influencer.stakeholders.length;

              const filteredFollowersByStruggle =
                influencer.stakeholders.filter(
                  (stakeholder) =>
                    stakeholder.socialPlatformUsername &&
                    filters.audienceStruggleChoiceIds.every((struggleId) => {
                      const struggleIds = stakeholder.stakeholderPosts.map(
                        (stakeholderPost) => {
                          const postStruggleIds =
                            stakeholderPost.postStruggles.map(
                              (struggle) => struggle.struggleId,
                            );
                          return postStruggleIds;
                        },
                      );

                      const flattenedArray = struggleIds.flatMap((arr) => arr);
                      const uniqueValues = [...new Set(flattenedArray)];

                      return uniqueValues.includes(struggleId);
                    }),
                );

              const filteredNumberOfFollowersByStruggle =
                filteredFollowersByStruggle.length;

              influencerStakeholders = influencerStakeholders.filter(
                (stakeholder) =>
                  filteredFollowersByStruggle.includes(stakeholder),
              );

              isMatch &&=
                totalFollowers &&
                (filteredNumberOfFollowersByStruggle / totalFollowers) * 100 >=
                  filterAlenativePercentage;
            }
          }
        }

        if (
          filters.audienceLanguageChoiceIds &&
          filters.audienceLanguageChoiceIds.length
        ) {
          if (
            filters.audienceLanguageUnitId &&
            filters.audienceLanguageUnitId === FilterUnit.Absolute
          ) {
            const filteredFollowersByLanguage = influencer.stakeholders.filter(
              (stakeholder) =>
                stakeholder.socialPlatformUsername &&
                filters.audienceLanguageChoiceIds.some((languageId) => {
                  const languageIds = stakeholder.stakeholderPosts.map(
                    (stakeholderPost) => {
                      const postLanguageId = this.mapLanguageCodeToEnum(
                        stakeholderPost.language,
                      );
                      return postLanguageId;
                    },
                  );

                  return languageIds.includes(languageId);
                }),
            );

            influencerStakeholders = influencerStakeholders.filter(
              (stakeholder) =>
                filteredFollowersByLanguage.includes(stakeholder),
            );

            isMatch &&= filters.audienceLanguageCount
              ? filteredFollowersByLanguage.length >=
                filters.audienceLanguageCount
              : !!filteredFollowersByLanguage.length;
          }

          if (
            filters.audienceLanguageUnitId &&
            filters.audienceLanguageUnitId === FilterUnit.Relative
          ) {
            const filterAlenativePercentage = filters.audienceLanguageCount
              ? this.clampValue(filters.audienceLanguageCount)
              : 1;

            const totalFollowers = influencer.stakeholders.length;

            const filteredFollowersByLanguage = influencer.stakeholders.filter(
              (stakeholder) =>
                stakeholder.socialPlatformUsername &&
                filters.audienceLanguageChoiceIds.some((languageId) => {
                  const languageIds = stakeholder.stakeholderPosts.map(
                    (stakeholderPost) => {
                      const postLanguageId = this.mapLanguageCodeToEnum(
                        stakeholderPost.language,
                      );
                      return postLanguageId;
                    },
                  );

                  return languageIds.includes(languageId);
                }),
            );

            influencerStakeholders = influencerStakeholders.filter(
              (stakeholder) =>
                filteredFollowersByLanguage.includes(stakeholder),
            );

            isMatch &&=
              totalFollowers &&
              (filteredFollowersByLanguage.length / totalFollowers) * 100 >=
                filterAlenativePercentage;
          }
        }

        if (
          filters.costPerTargetMin !== undefined ||
          filters.costPerTargetMax !== undefined
        ) {
          if (!influencerStakeholders.length) {
            isMatch &&= false;
          } else {
            const postDesiredAmount =
              influencer.influencerCampaignAmounts.find(
                (campaignAmount) => campaignAmount.postType === PostType.Post,
              )?.desiredAmount || null;

            const reelDesiredAmount =
              influencer.influencerCampaignAmounts.find(
                (campaignAmount) => campaignAmount.postType === PostType.Reel,
              )?.desiredAmount || null;

            const storyDesiredAmount =
              influencer.influencerCampaignAmounts.find(
                (campaignAmount) => campaignAmount.postType === PostType.Story,
              )?.desiredAmount || null;

            const costPerPostTargetFn = (postType: PostType) => {
              let result: number = null;

              switch (postType) {
                case PostType.Post:
                  result = postDesiredAmount
                    ? postDesiredAmount.toNumber() /
                      influencerStakeholders.length
                    : null;
                  break;
                case PostType.Reel:
                  result = reelDesiredAmount
                    ? reelDesiredAmount.toNumber() /
                      influencerStakeholders.length
                    : null;
                  break;

                case PostType.Story:
                  result = storyDesiredAmount
                    ? storyDesiredAmount.toNumber() /
                      influencerStakeholders.length
                    : null;
                  break;

                default:
                  result = null;
              }
              return result;
            };

            const costPerTarget =
              filters.performancePostTypeId === 0 ||
              filters.performancePostTypeId
                ? costPerPostTargetFn(filters.performancePostTypeId)
                : null;

            influencer.costPerTarget = costPerTarget;

            if (filters.costPerTargetMin !== undefined) {
              isMatch &&= costPerTarget >= filters.costPerTargetMin;
            }

            if (filters.costPerTargetMax !== undefined) {
              isMatch &&= costPerTarget <= filters.costPerTargetMax;
            }
          }
        }

        if (
          filters.costPerQuestionCreditMin !== undefined ||
          filters.costPerQuestionCreditMax !== undefined
        ) {
          const questionCreditAmount =
            influencer.influencerSurveyAmounts
              .find(
                (surveyAmount) =>
                  surveyAmount.surveyType === SurveyType.Questionnaire,
              )
              ?.desiredAmount.toNumber() || null;

          if (!questionCreditAmount) {
            isMatch &&= false;
          } else {
            if (filters.costPerQuestionCreditMin !== undefined) {
              isMatch &&=
                questionCreditAmount >= filters.costPerQuestionCreditMin;
            }

            if (filters.costPerQuestionCreditMax !== undefined) {
              isMatch &&=
                questionCreditAmount <= filters.costPerQuestionCreditMax;
            }
          }
        }

        if (
          filters.performancePostTypeId !== undefined &&
          (filters.costPerLikeMin !== undefined ||
            filters.costPerLikeMax !== undefined)
        ) {
          if (influencer.influencerFromApp === undefined) {
            isMatch &&= false;
          } else {
            const lastFivePercentOfPosts: (StakeholderPost & {
              postDiseaseAreas: PostDiseaseArea[];
              postStruggles: PostStruggle[];
            })[] = this.getLast5PercentPosts(
              influencer.influencerFromApp.stakeholderPosts,
            );

            const postDesiredAmount =
              +influencer.influencerCampaignAmounts.find(
                (campaignAmount) => campaignAmount.postType === PostType.Post,
              )?.desiredAmount || null;

            const reelDesiredAmount =
              +influencer.influencerCampaignAmounts.find(
                (campaignAmount) => campaignAmount.postType === PostType.Reel,
              )?.desiredAmount || null;

            const storyDesiredAmount =
              +influencer.influencerCampaignAmounts.find(
                (campaignAmount) => campaignAmount.postType === PostType.Story,
              )?.desiredAmount || null;

            const costPerPostTargetDesiredAmount = (postType: PostType) => {
              let result: number = null;
              // if (
              //   !influencer.influencerFromApp &&
              //   !influencerStakeholders.length
              // ) {
              //   return null;
              // }
              switch (postType) {
                case PostType.Post:
                  result = postDesiredAmount || null;
                  break;
                case PostType.Reel:
                  result = reelDesiredAmount || null;
                  break;

                case PostType.Story:
                  result = storyDesiredAmount || null;
                  break;

                default:
                  result = null;
              }
              return result;
            };

            const desiredAmount = costPerPostTargetDesiredAmount(
              filters.performancePostTypeId,
            );

            const averageLikes = lastFivePercentOfPosts.map(
              (posts) => posts.likes,
            ).length
              ? lastFivePercentOfPosts
                  .map((posts) => posts.likes)
                  .reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0,
                  ) / lastFivePercentOfPosts.map((posts) => posts.likes).length
              : 0;

            const costPerLike = averageLikes ? desiredAmount / averageLikes : 0;

            if (filters.costPerLikeMin === 0 || filters.costPerLikeMin) {
              isMatch &&= costPerLike >= filters.costPerLikeMin;
            }

            if (filters.costPerLikeMax === 0 || filters.costPerLikeMax) {
              isMatch &&= costPerLike <= filters.costPerLikeMax;
            }
          }
        }

        if (
          filters.performancePostTypeId !== undefined &&
          (filters.costPerCommentMin !== undefined ||
            filters.costPerCommentMax !== undefined)
        ) {
          if (influencer.influencerFromApp === undefined) {
            isMatch &&= false;
          } else {
            const lastFivePercentOfPosts: (StakeholderPost & {
              postDiseaseAreas: PostDiseaseArea[];
              postStruggles: PostStruggle[];
            })[] = this.getLast5PercentPosts(
              influencer.influencerFromApp.stakeholderPosts,
            );

            const postDesiredAmount =
              +influencer.influencerCampaignAmounts.find(
                (campaignAmount) => campaignAmount.postType === PostType.Post,
              )?.desiredAmount || null;

            const reelDesiredAmount =
              +influencer.influencerCampaignAmounts.find(
                (campaignAmount) => campaignAmount.postType === PostType.Reel,
              )?.desiredAmount || null;

            const storyDesiredAmount =
              +influencer.influencerCampaignAmounts.find(
                (campaignAmount) => campaignAmount.postType === PostType.Story,
              )?.desiredAmount || null;

            const costPerPostTargetDesiredAmount = (postType: PostType) => {
              let result: number = null;

              switch (postType) {
                case PostType.Post:
                  result = postDesiredAmount || null;
                  break;
                case PostType.Reel:
                  result = reelDesiredAmount || null;
                  break;

                case PostType.Story:
                  result = storyDesiredAmount || null;
                  break;

                default:
                  result = null;
              }
              return result;
            };

            const desiredAmount = costPerPostTargetDesiredAmount(
              filters.performancePostTypeId,
            );

            const averageComments = lastFivePercentOfPosts.map(
              (posts) => posts.comments,
            ).length
              ? lastFivePercentOfPosts
                  .map((posts) => posts.comments)
                  .reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0,
                  ) /
                lastFivePercentOfPosts.map((posts) => posts.comments).length
              : 0;

            const costPerComment = averageComments
              ? desiredAmount / averageComments
              : 0;

            if (filters.costPerCommentMin === 0 || filters.costPerCommentMin) {
              isMatch &&= costPerComment >= filters.costPerCommentMin;
            }

            if (filters.costPerCommentMax === 0 || filters.costPerCommentMax) {
              isMatch &&= costPerComment <= filters.costPerCommentMax;
            }
          }
        }

        if (
          filters.performancePostTypeId !== undefined &&
          (filters.costPerEngagementMin !== undefined ||
            filters.costPerEngagementMax !== undefined)
        ) {
          if (influencer.influencerFromApp === undefined) {
            isMatch &&= false;
          } else {
            const lastFivePercentOfPosts: (StakeholderPost & {
              postDiseaseAreas: PostDiseaseArea[];
              postStruggles: PostStruggle[];
            })[] = this.getLast5PercentPosts(
              influencer.influencerFromApp.stakeholderPosts,
            );

            const postDesiredAmount =
              +influencer.influencerCampaignAmounts.find(
                (campaignAmount) => campaignAmount.postType === PostType.Post,
              )?.desiredAmount || null;

            const reelDesiredAmount =
              +influencer.influencerCampaignAmounts.find(
                (campaignAmount) => campaignAmount.postType === PostType.Reel,
              )?.desiredAmount || null;

            const storyDesiredAmount =
              +influencer.influencerCampaignAmounts.find(
                (campaignAmount) => campaignAmount.postType === PostType.Story,
              )?.desiredAmount || null;

            const costPerPostTargetDesiredAmount = (postType: PostType) => {
              let result: number = null;

              switch (postType) {
                case PostType.Post:
                  result = postDesiredAmount || null;
                  break;
                case PostType.Reel:
                  result = reelDesiredAmount || null;
                  break;

                case PostType.Story:
                  result = storyDesiredAmount || null;
                  break;

                default:
                  result = null;
              }
              return result;
            };

            const desiredAmount = costPerPostTargetDesiredAmount(
              filters.performancePostTypeId,
            );

            const averageLikes = lastFivePercentOfPosts.map(
              (posts) => posts.likes,
            ).length
              ? lastFivePercentOfPosts
                  .map((posts) => posts.likes)
                  .reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0,
                  ) / lastFivePercentOfPosts.map((posts) => posts.likes).length
              : 0;

            const averageComments = lastFivePercentOfPosts.map(
              (posts) => posts.comments,
            ).length
              ? lastFivePercentOfPosts
                  .map((posts) => posts.comments)
                  .reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0,
                  ) /
                lastFivePercentOfPosts.map((posts) => posts.comments).length
              : 0;

            const costPerEngagement = !!(averageLikes + averageComments)
              ? desiredAmount / (averageLikes + averageComments)
              : 0;

            if (
              filters.costPerEngagementMin === 0 ||
              filters.costPerEngagementMin
            ) {
              isMatch &&= costPerEngagement >= filters.costPerEngagementMin;
            }

            if (
              filters.costPerEngagementMax === 0 ||
              filters.costPerEngagementMax
            ) {
              isMatch &&= costPerEngagement <= filters.costPerEngagementMax;
            }
          }
        }

        if (
          filters.totalEarningsMin !== undefined ||
          filters.totalEarningsMax !== undefined
        ) {
          if (!influencer.user.transactionFlow.length) {
            isMatch &&= false;
          } else {
            const transactionEarnings = influencer.user.transactionFlow
              .map((transaction) => transaction.amount.toNumber())
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
              );

            if (filters.totalEarningsMin === 0 || filters.totalEarningsMin) {
              isMatch &&= transactionEarnings >= filters.totalEarningsMin;
            }

            if (filters.totalEarningsMax === 0 || filters.totalEarningsMax) {
              isMatch &&= transactionEarnings <= filters.totalEarningsMax;
            }
          }
        }

        if (
          filters.earningsLast30DaysMin !== undefined ||
          filters.earningsLast30DaysMax !== undefined
        ) {
          let date30DaysAgo = new Date();
          date30DaysAgo.setHours(0, 0, 0, 0);
          date30DaysAgo = addDays(date30DaysAgo, -30);

          const transactionFlow30DaysAgo =
            influencer.user.transactionFlow.filter(
              (transactionFlow) => transactionFlow.createdAt >= date30DaysAgo,
            );

          if (!influencer.user.transactionFlow.length) {
            isMatch &&= false;
          } else {
            const transactionEarnings = transactionFlow30DaysAgo
              .map((transaction) => transaction.amount.toNumber())
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
              );

            if (
              filters.earningsLast30DaysMin === 0 ||
              filters.earningsLast30DaysMin
            ) {
              isMatch &&= transactionEarnings >= filters.earningsLast30DaysMin;
            }

            if (
              filters.earningsLast30DaysMax === 0 ||
              filters.earningsLast30DaysMax
            ) {
              isMatch &&= transactionEarnings <= filters.earningsLast30DaysMax;
            }
          }
        }

        if (
          filters.totalProjectsMin !== undefined ||
          filters.totalProjectsMax !== undefined
        ) {
          const influencersThatCountIntoProducts =
            influencer.platformProductOrderInfluencers.filter(
              (platformInfluencer) => {
                return [
                  ProductOrderInfluencerStatus.Added,
                  ProductOrderInfluencerStatus.Invited,
                  ProductOrderInfluencerStatus.NotSelected,
                  ProductOrderInfluencerStatus.Removed,
                  ProductOrderInfluencerStatus.Withdrawn,
                ].includes(platformInfluencer.status);
              },
            );

          const totalProjects = influencersThatCountIntoProducts.length;

          if (filters.totalProjectsMin === 0 || filters.totalProjectsMin) {
            isMatch &&= totalProjects >= filters.totalProjectsMin;
          }

          if (filters.totalProjectsMax === 0 || filters.totalProjectsMax) {
            isMatch &&= totalProjects <= filters.totalProjectsMax;
          }
        }

        if (
          filters.projectsLast30DaysMin !== undefined ||
          filters.projectsLast30DaysMax !== undefined
        ) {
          let date30DaysAgo = new Date();
          date30DaysAgo.setHours(0, 0, 0, 0);
          date30DaysAgo = addDays(date30DaysAgo, -30);

          const influencersThatCountIntoProducts =
            influencer.platformProductOrderInfluencers.filter(
              (platformInfluencer) => {
                return ![
                  ProductOrderInfluencerStatus.Added,
                  ProductOrderInfluencerStatus.Invited,
                  ProductOrderInfluencerStatus.NotSelected,
                  ProductOrderInfluencerStatus.Removed,
                  ProductOrderInfluencerStatus.Withdrawn,
                ].includes(platformInfluencer.status);
              },
            );

          const totalProjectsInLast30Days =
            influencersThatCountIntoProducts.filter(
              (platformInfluencer) =>
                platformInfluencer.createdAt >= date30DaysAgo,
            ).length;

          if (
            filters.projectsLast30DaysMin === 0 ||
            filters.projectsLast30DaysMin
          ) {
            isMatch &&=
              totalProjectsInLast30Days >= filters.projectsLast30DaysMin;
          }

          if (
            filters.projectsLast30DaysMax === 0 ||
            filters.projectsLast30DaysMax
          ) {
            isMatch &&=
              totalProjectsInLast30Days <= filters.projectsLast30DaysMax;
          }
        }

        return isMatch;
      });

    if (filters.prioritizeBy?.length) {
      if (filters.prioritizeBy === 'costPerTarget') {
        influencersFormattedFromInfluencer.sort(
          (a, b) => b.costPerTarget - a.costPerTarget,
        );
      }

      if (filters.prioritizeBy === 'costPerEngagement') {
        influencersFormattedFromInfluencer.sort(
          (a, b) => +b.costPerEngagement - +a.costPerEngagement,
        );
      }

      if (filters.prioritizeBy === 'postDesiredAmount') {
        influencersFormattedFromInfluencer.sort(
          (a, b) => +b.postDesiredAmount - +a.postDesiredAmount,
        );
      }

      if (filters.prioritizeBy === 'reelDesiredAmount') {
        influencersFormattedFromInfluencer.sort(
          (a, b) => +b.reelDesiredAmount - +a.reelDesiredAmount,
        );
      }

      if (filters.prioritizeBy === 'storyDesiredAmount') {
        influencersFormattedFromInfluencer.sort(
          (a, b) => +b.storyDesiredAmount - +a.storyDesiredAmount,
        );
      }

      if (filters.prioritizeBy === 'questionCreditDesiredAmount') {
        influencersFormattedFromInfluencer.sort(
          (a, b) => +b.questionCreditAmount - +a.questionCreditAmount,
        );
      }
    }

    const influencersToRemove = new Set();

    if (
      filters.audienceOverlap !== undefined &&
      influencersFormattedFromInfluencer.length >= 1
    ) {
      for (let i = 0; i < influencersFormattedFromInfluencer.length; i++) {
        if (!influencersToRemove.has(i)) {
          for (
            let j = i + 1;
            j < influencersFormattedFromInfluencer.length;
            j++
          ) {
            const influencerOne = influencersFormattedFromInfluencer[i];
            const influencerTwo = influencersFormattedFromInfluencer[j];

            const overlapPercentage = this.calculateFollowerOverlap(
              influencerOne,
              influencerTwo,
            );

            if (overlapPercentage >= filters.audienceOverlap) {
              influencersToRemove.add(j);
            }
          }
        }
      }
    }

    const influencersWithOverlap = influencersFormattedFromInfluencer.filter(
      (_, index) => !influencersToRemove.has(index),
    );

    const influencersFormattedFromInfluencerId = influencersWithOverlap
      .map((influencer) => influencer.id)
      .slice(
        0,
        filters.influencersNeeded !== undefined && filters.influencersNeeded > 0
          ? filters.influencersNeeded
          : influencersFormattedFromInfluencer.length > 1
          ? influencersFormattedFromInfluencer.length - 1
          : 1,
      );

    const influencers = await getPaginatedResults<
      Prisma.InfluencerFindManyArgs,
      Influencer & {
        user: User & {
          assigneeUserLabels: (UserLabel & { label: Label })[];
          location: Location & { country: Location };
          invitedInfluencers: (Influencer & { user: User })[];
        };
        stakeholders: (Stakeholder & {
          socialPlatform: SocialPlatformModel;
          patientCaregiverDiseaseAreas: (PatientCaregiverDiseaseArea & {
            diseaseArea: DiseaseArea & {
              parentDiseaseArea: DiseaseArea;
            };
          })[];
          stakeholderPosts: (StakeholderPost & {
            postThemes: (PostTheme & { theme: Theme })[];
            postSymptoms: (PostSymptom & { sympyom: Symptom })[];
            postDiseaseAreas: (PostDiseaseArea & {
              diseaseArea: DiseaseArea;
            })[];
          })[];
        })[];
        invitedByUser: User;
        ethnicity: Ethnicity;
        influencerCampaignAmounts: InfluencerCampaignAmount[];
        influencerSurveyAmounts: InfluencerSurveyAmount[];
        influencerDiseaseAreas: {
          id: number;
          diseaseAreaId: number;
          diseaseArea: DiseaseArea & {
            parentDiseaseArea: DiseaseArea;
          };
        }[];
      }
    >(
      this.prismaService,
      Prisma.ModelName.Influencer,
      {
        where: {
          ...whereQuery,
          id: {
            in: influencersFormattedFromInfluencerId,
          },
          /* ...influencerSearchFilterQuery,
          ...influencerFilterQuery,
          user: {
            ...userFilterQuery,
          },
          OR: [
            {
              stakeholders: {
                some: {
                  ...stakeholderFilterQuery,
                },
              },
            },
            {
              stakeholders: !isAnyStakeholderFilterActive
                ? {
                    none: {},
                  }
                : undefined,
            },
          ], */
        },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              status: true,
              currency: true,
              createdAt: true,
              updatedAt: true,
              assigneeUserLabels: {
                select: {
                  label: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
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
              invitedInfluencers: {
                select: {
                  id: true,
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                      status: true,
                    },
                  },
                },
              },
            },
          },
          invitedByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          gender: true,
          dateOfBirth: true,
          verifiedSince: true,
          influencerCampaignAmounts: {
            select: {
              _count: true,
              desiredAmount: true,
              postType: true,
            },
          },
          influencerSurveyAmounts: {
            select: {
              _count: true,
              desiredAmount: true,
              surveyType: true,
            },
          },
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

          type: true,
          ethnicity: {
            select: {
              id: true,
              name: true,
            },
          },
          stakeholders: {
            select: {
              patientCaregiverDiseaseAreas: {
                select: {
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
              gender: true,
              age: true,
              socialPlatform: {
                select: {
                  id: true,
                  name: true,
                },
              },
              socialPlatformUsername: true,
              followersCount: true,
              type: true,
              stakeholderPosts: {
                select: {
                  postThemes: {
                    select: {
                      theme: true,
                    },
                  },
                  postDiseaseAreas: {
                    select: {
                      diseaseArea: true,
                    },
                  },
                  postStruggles: {
                    select: {
                      struggle: true,
                    },
                  },
                  postSymptom: {
                    select: {
                      symptom: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      { skip, limit: take },
      influencersFormattedFromInfluencerId,
    );

    const currentDate = new Date();

    const result = influencers.data
      .map((influencer) => {
        const influencerPerSocialPlatforms: InfluencerTableResponseEntity[] =
          [];

        const filterPatientCaregiverStakeholders =
          influencer.stakeholders.filter(
            (stakeholder) =>
              stakeholder.type === StakeholderType.Patient ||
              stakeholder.type === StakeholderType.Caregiver,
          );

        const filterDoctorStakeholders = influencer.stakeholders.filter(
          (stakeholder) => stakeholder.type === StakeholderType.Doctor,
        );

        const filterNurseStakeholders = influencer.stakeholders.filter(
          (stakeholder) => stakeholder.type === StakeholderType.Nurse,
        );

        const medicalStakeholders = influencer.stakeholders.filter(
          (stakeholder) => stakeholder.type !== StakeholderType.NonMedical,
        );

        const patientCaregiverRatio =
          filterPatientCaregiverStakeholders.length /
          medicalStakeholders.length;

        const doctorRatio =
          filterDoctorStakeholders.length / medicalStakeholders.length;

        const nurseRatio =
          filterNurseStakeholders.length / medicalStakeholders.length;

        const targetedDieaseAreas = influencer.stakeholders.map(
          (stakeholder) => {
            return stakeholder.stakeholderPosts.filter((post) => {
              return filters.diseaseAreaIds?.includes(
                post.postDiseaseAreas[0].diseaseAreaId,
              );
            });
          },
        );

        const targetedSymptoms = influencer.stakeholders.map((stakeholder) => {
          return stakeholder.stakeholderPosts.filter((post) => {
            return filters.symptomsIds?.includes(
              post.postSymptoms[0].symptomId,
            );
          });
        });

        const targetedAge = influencer.stakeholders.filter((stakeholder) => {
          return (
            differenceInYears(currentDate, stakeholder.age) >= filters.ageMin &&
            differenceInYears(currentDate, stakeholder.age) <= filters.ageMax
          );
        });

        const targetedGender = influencer.stakeholders.filter((stakeholder) => {
          return filters?.genderIds && stakeholder.gender === 0;
        });

        const targetedEthnicity = influencer.stakeholders.filter(
          (stakeholder) => {
            return (
              filters?.ethnicityIds &&
              filters.ethnicityIds.includes(stakeholder.ethnicityId)
            );
          },
        );

        const targetedLocation = influencer.stakeholders.filter(
          (stakeholder) => {
            return (
              filters?.locationIds &&
              filters.locationIds?.includes(stakeholder.locationId)
            );
          },
        );

        const targetedDieaseAreasRatio =
          targetedDieaseAreas.flat().length / medicalStakeholders.length;

        const targetedSymptomsRatio =
          targetedSymptoms.flat().length / medicalStakeholders.length;

        const targetedLocationRatio =
          targetedLocation.length / medicalStakeholders.length;

        // const targetedStrugglesRatio =
        //   targetedStruggles.flat().length / medicalStakeholders.length;

        const targetedGenderRatio =
          targetedGender.length / medicalStakeholders.length;

        const targetedAgeRatio =
          targetedAge.length / medicalStakeholders.length;

        const targetedEthnicityRatio =
          targetedEthnicity.length / medicalStakeholders.length;

        const targetTotal =
          targetedDieaseAreas.flat().length +
          targetedSymptoms.flat().length +
          // targetedStruggles.flat().length +
          targetedGender.length +
          targetedAge.length +
          targetedEthnicity.length;

        const targetRatio = targetTotal / medicalStakeholders.length;

        let averageLikes = 0;
        let averageComments = 0;
        let engagement = 0;
        let followersCount = 0;

        this.prismaService.stakeholder
          .findFirst({
            where: {
              influencer: {
                stakeholderId: influencer.stakeholderId,
              },
            },
          })
          .then((data) => {
            averageLikes = data?.likesCount / data?.postCount;
            averageComments = data?.commentsCount / data?.postCount;
            engagement =
              (data?.likesCount + data?.commentsCount) / data?.followersCount;
            followersCount = data?.followersCount;
          });

        const tableInfluencer = new InfluencerTableResponseEntity({
          user: {
            id: influencer.user.id,
            firstName: influencer.user.firstName,
            lastName: influencer.user.lastName,
            email: influencer.user.email,
            age:
              influencer.dateOfBirth &&
              differenceInYears(currentDate, influencer.dateOfBirth),
            gender: influencer.gender,
          },
          id: influencer.user.id,
          influencerId: influencer.id,
          experienceAs: influencer.type,
          socialMedia: null,
          username: null,
          verifiedSince: influencer.verifiedSince,
          diseaseAreas: influencer.influencerDiseaseAreas.map((diseaseArea) => {
            return new DiseaseAreaTableResponseEntity({
              id: diseaseArea.diseaseAreaId,
              name: diseaseArea.diseaseArea.name,
              parentDiseaseArea: new DiseaseAreaTableResponseEntity(
                diseaseArea.diseaseArea.parentDiseaseArea,
              ),
            });
          }),
          location: influencer.user.location
            ? new LocationTableResponseEntity({
                id: influencer.user.location.id,
                name: influencer.user.location.name,
                country:
                  influencer.user.location.country &&
                  new LocationTableResponseEntity(
                    influencer.user.location.country,
                  ),
              })
            : undefined,
          invitedBy: new UserTableResponseEntity(influencer.invitedByUser),
          invited: influencer.user.invitedInfluencers
            .filter(
              (invitedInfluencer) =>
                invitedInfluencer.user.status > UserStatus.Unconfirmed,
            )
            .map(
              (invitedInfluencer) =>
                new UserTableResponseEntity(invitedInfluencer.user),
            ),
          ethnicity: new EthnicityTableResponseEntity(influencer.ethnicity),
          followers: followersCount,
          labels: influencer.user.assigneeUserLabels.map(
            (label) => new LabelTableResponseEntity(label.label),
          ),
          registeredAt: influencer.user.createdAt,
          postAmount: influencer.influencerCampaignAmounts
            .find(
              (desiredAmountSetting) =>
                desiredAmountSetting.postType === PostType.Post,
            )
            ?.desiredAmount.toNumber(),
          reelAmount: influencer.influencerCampaignAmounts
            .find(
              (desiredAmountSetting) =>
                desiredAmountSetting.postType === PostType.Reel,
            )
            ?.desiredAmount.toNumber(),
          storyAmount: influencer.influencerCampaignAmounts
            .find(
              (desiredAmountSetting) =>
                desiredAmountSetting.postType === PostType.Story,
            )
            ?.desiredAmount.toNumber(),
          questionCreditAmount: influencer.influencerSurveyAmounts
            .find(
              (desiredAmountSetting) =>
                desiredAmountSetting.surveyType === SurveyType.Questionnaire,
            )
            ?.desiredAmount.toNumber(),
          shortInterviewAmount: influencer.influencerSurveyAmounts
            .find(
              (desiredAmountSetting) =>
                desiredAmountSetting.surveyType === SurveyType.Short_Interview,
            )
            ?.desiredAmount.toNumber(),
          longInterviewAmount: influencer.influencerSurveyAmounts
            .find(
              (desiredAmountSetting) =>
                desiredAmountSetting.surveyType === SurveyType.Long_Interview,
            )
            ?.desiredAmount.toNumber(),
          patientCaregiverRatio,
          doctorRatio,
          nurseRatio,
          targetedDieaseAreasRatio,
          targetedSymptomsRatio,
          // targetedStrugglesRatio,
          targetedGenderRatio,
          targetedAgeRatio,
          targetedEthnicityRatio,
          targetRatio,
          targetTotal,
          averageLikes,
          averageComments,
          engagement,
          targetedLocationRatio,
        });

        // add an user as if he has 1 social platform
        influencerPerSocialPlatforms.push(tableInfluencer);

        return influencerPerSocialPlatforms;
      })
      .flat();

    influencers.data = null;
    influencers.dataFormatted = result;
    influencers.pagination.itemCountReal = result.length;

    return influencers;
  }

  async findAll(
    { skip, take }: PaginationParamsDto,
    { includeDeleted = false }: FilterParamsDto,
  ): Promise<PaginationResult<User>> {
    const queryWhere: Prisma.UserWhereInput = { role: UserRole.Influencer };
    if (!includeDeleted) queryWhere.isDeleted = false;
    const queryInclude: Prisma.UserInclude = {
      influencer: { include: { invitedByUser: true } },
    };
    // ! queryOrderBy is WIP
    const queryOrderBy: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput> =
      undefined;

    try {
      const result = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.user,
        {
          where: queryWhere,
          skip,
          take,
          orderBy: queryOrderBy,
          include: queryInclude,
        },
      )();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(id: number) {
    try {
      const user = await this.prismaService.user.update({
        where: { id },
        data: { isDeleted: true },
      });

      const deletedUserId = user.id;

      await this.prismaService.influencer.updateMany({
        where: {
          invitendByUserId: {
            in: deletedUserId,
          },
        },
        data: {
          invitendByUserId: null,
        },
      });

      return user;
    } catch (error) {
      // * can throw PrismaClientKnownRequestError P2025
      throw error;
    }
  }

  async deleteMany(dto: DeleteManyInfluencersDto) {
    const { userIds } = dto;
    try {
      const existingUsers = await this.prismaService.user.findMany({
        where: {
          id: { in: userIds },
        },
        select: {
          id: true,
        },
      });

      const existingUserIds = existingUsers.map((user) => user.id);
      const missingUserIds = userIds.filter(
        (userId) => !existingUserIds.includes(userId),
      );

      if (missingUserIds.length > 0) {
        throw new NotFoundException(
          `Users with IDs ${missingUserIds.join(', ')} not found.`,
        );
      }

      const updatedUsers = await this.prismaService.user.updateMany({
        where: {
          id: {
            in: userIds,
          },
        },
        data: {
          isDeleted: true,
        },
      });

      await this.prismaService.influencer.updateMany({
        where: {
          invitendByUserId: {
            in: userIds,
          },
        },
        data: {
          invitendByUserId: null,
        },
      });

      return updatedUsers;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateInfluencerDto: UpdateInfluencerDto) {
    // check if influencer exists
    const userInfluencer = await this.findOne(id);

    const {
      firstName,
      lastName,
      email,
      password,
      locationId,
      currency,
      gender,
      dateOfBirth,
      ethnicityId,
      type,
      diseaseAreas,
      // socialPlatforms,
      campaignDesiredIncome,
      surveyDesiredIncome,
      status,
      instagramUsername,
    } = updateInfluencerDto;

    // constexistingSocialPlatforms = await this.getSocialPlatforms(id);
    // const existingSocialPlatforms = [];

    // const socialPlatformsWithVendorId: Array<{
    //   socialPlatformId: number;
    //   socialPlatformUserId: string | number;
    //   // ? iv?: string;
    // }> = [];

    // Temporary set social platform to empty
    // existingSocialPlatforms = [];

    // for every existing social platform there has to be the same social platform in the new data (HTTP PUT)
    // if (
    //   existingSocialPlatforms &&
    //   !existingSocialPlatforms.every((existingSocialPlatform) =>
    //     socialPlatforms.some(
    //       (socialPlatform) =>
    //         socialPlatform.socialPlatformId ===
    //         existingSocialPlatform.socialPlatformId,
    //     ),
    //   )
    // ) {
    //   throw new SocialPlatformUnchangeableException(
    //     `Can't de-sync any social network: Please contact the support if you decide to de-sync your social network account`,
    //   );
    // }

    // for (const socialPlatform of socialPlatforms) {
    //   // if authorization code is in the body, use it
    //   if (socialPlatform.authorizationCode !== undefined) {
    //     const { userId: vendorId } =
    //       await this.instagramService.exchangeCodeForAccessToken(
    //         socialPlatform.authorizationCode,
    //         false,
    //       );

    //     // check if social platform is registered, but user tried to swap its existing platform ID (account swap)
    //     if (
    //       existingSocialPlatforms.some(
    //         (existingSocialPlatform) =>
    //           existingSocialPlatform.socialPlatformId ===
    //             socialPlatform.socialPlatformId &&
    //           existingSocialPlatform.socialPlatformUserId !==
    //             vendorId.toString(),
    //       )
    //     ) {
    //       // TODO return international response
    //       throw new SocialPlatformUnchangeableException(
    //         `Can't update social network (${socialPlatform.socialPlatformId}) that was previously synced: Please contact the support if you decide to switch an account`,
    //       );
    //     }

    //     // create/update
    //     socialPlatformsWithVendorId.push({
    //       socialPlatformId: socialPlatform.socialPlatformId,
    //       socialPlatformUserId: vendorId,
    //     });
    //   } else {
    //     if (
    //       !existingSocialPlatforms.some(
    //         (existingSocialPlatform) =>
    //           existingSocialPlatform.socialPlatformId ===
    //           socialPlatform.socialPlatformId,
    //       )
    //     ) {
    //       throw new SocialPlatformMissingDataException(
    //         `Can't connect to social network (${socialPlatform.socialPlatformId}): Authorization code missing`,
    //       );
    //     }

    //     socialPlatformsWithVendorId.push({
    //       socialPlatformId: socialPlatform.socialPlatformId,
    //       socialPlatformUserId: existingSocialPlatforms.find(
    //         (existingSocialPlatform) =>
    //           existingSocialPlatform.socialPlatformId ===
    //           socialPlatform.socialPlatformId,
    //       ).socialPlatformUserId,
    //     });
    //   }
    // }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        password: password !== undefined ? await Hash(password) : undefined,
        locationId,
        currency,
        status,
        influencer: {
          update: {
            gender,
            dateOfBirth,
            ethnicityId,
            type,
            instagramUsername,
            //#region update the tables related to influencer by overriding existing data
            influencerDiseaseAreas: generateRelatedModelCRUDFactory<
              InfluencerDiseaseArea,
              Prisma.InfluencerDiseaseAreaWhereUniqueInput
            >()(
              diseaseAreas,
              {
                id: userInfluencer.influencer.id,
                foreignKey: 'influencerId',
              },
              [{ id: (obj) => obj, foreignKey: 'diseaseAreaId' }],
              'InfluencerDiseaseAreaIdentifier',
            ),
            // stakeholders: generateRelatedModelCRUDFactory<
            //   Stakeholder,
            //   Prisma.StakeholderWhereUniqueInput
            // >()(
            //   // socialPlatforms,
            //   socialPlatformsWithVendorId,
            //   {
            //     id: userInfluencer.influencer.id,
            //     foreignKey: 'influencerId',
            //   },
            //   [
            //     {
            //       id: (obj) => obj.socialPlatformId,
            //       foreignKey: 'socialPlatformId',
            //     },
            //   ],
            //   'InfluencerStakeholderIdentifier',
            //   (obj) => ({
            //     socialPlatformId: obj.socialPlatformId,
            //     // TODO socialPlatformUserId: obj.vendorId,
            //     socialPlatformUserId: obj.socialPlatformUserId.toString(),
            //     type: StakeholderType.RegisteredPatient,
            //     isRegistered: true,
            //   }),
            // ),
            influencerCampaignAmounts: generateRelatedModelCRUDFactory<
              InfluencerCampaignAmount,
              Prisma.InfluencerCampaignAmountWhereUniqueInput
            >()(
              campaignDesiredIncome,
              {
                id: userInfluencer.influencer.id,
                foreignKey: 'influencerId',
              },
              [{ id: (obj) => obj.postType, foreignKey: 'postType' }],
              'InfluencerCampaignAmountIdentifier',
            ),
            influencerSurveyAmounts: generateRelatedModelCRUDFactory<
              InfluencerSurveyAmount,
              Prisma.InfluencerSurveyAmountWhereUniqueInput
            >()(
              surveyDesiredIncome,
              {
                id: userInfluencer.influencer.id,
                foreignKey: 'influencerId',
              },
              [{ id: (obj) => obj.surveyType, foreignKey: 'surveyType' }],
              'InfluencerSurveyAmountIdentifier',
            ),
            //#endregion
          },
        },
      },
      include: InfluencerService.queryInclude,
    });

    if (
      updatedUser &&
      status === UserStatus.ToBeApproved &&
      updatedUser.status === UserStatus.ToBeApproved
    ) {
      await this.notificationService.influencerVerified(
        updatedUser.id,
        `${updatedUser.firstName} ${updatedUser.lastName}`,
      );
    }

    if (
      updatedUser &&
      updatedUser.status === UserStatus.Approved &&
      password === undefined
    ) {
      await this.notificationService.influencerApproved(updatedUser.id);
    }

    return updatedUser;
  }

  private async getSocialPlatforms(id: number) {
    const stakeholders = await this.stakeholderService.find({
      influencer: { userId: id },
    });
    const socialPlatforms = stakeholders.map((stakeholder) => ({
      socialPlatformId: stakeholder.socialPlatformId,
      socialPlatformUserId: stakeholder.socialPlatformUserId,
    }));

    return socialPlatforms;
  }

  async verifyByUserId(id: number) {
    const user = await this.prismaService.$transaction(async (tx) => {
      await tx.user.findFirstOrThrow({
        where: {
          id,
          role: UserRole.Influencer,
          firstName: { not: null },
          lastName: { not: null },
          email: { not: null },
          password: { not: null },
          location: { isNot: null },
          currency: { not: null },
          influencer: {
            dateOfBirth: { not: null },
            gender: { not: null },
            ethnicity: { isNot: null },
            type: { not: null },
            influencerDiseaseAreas: { some: {} },
            stakeholders: {
              // some: { socialPlatformId: SocialPlatform.Instagram },
              // * at least one social platform
              some: {},
            },
            influencerSurveyAmounts: { some: {} },
            influencerCampaignAmounts: {
              some: {},
            },
          },
        },
      });

      return await this.prismaService.user.update({
        where: { id },
        data: {
          status: UserStatus.Approved,
          influencer: {
            update: {
              verifiedSince: new Date(),
            },
          },
        },
      });
    });
    return user;
  }

  async sendEmail(userId: number, { content }: SendEmailDto) {
    // user influencer
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
    });

    await this.mailService.sendEmptyInfluencer(
      user.email,
      user.firstName,
      content,
    );
  }

  private handleGender(gender: Gender) {
    switch (gender) {
      case Gender.Male:
        return 'Male';
      case Gender.Female:
        return 'Female';
      case Gender.Other:
        return 'Other';
      default:
        return 'Not Specified';
    }
  }

  async exportInfluencers(dto: FindByIdsDto) {
    const queryWhere: Prisma.InfluencerWhereInput = {
      user: {
        status: UserStatus.Approved,
        isDeleted: false,
        id: {
          in: dto.ids,
        },
      },
    };

    const queryInclude = {
      campaignInfluencerPerformances: {
        include: {
          campaign: true,
        },
      },
      ethnicity: true,
      influencerDiseaseAreas: {
        include: {
          diseaseArea: true,
        },
      },
      user: {
        include: {
          location: {
            select: {
              name: true,
              country: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      invitedByUser: true,
      stakeholders: {
        include: {
          campaignLikers: true,
        },
      },
      influencerCampaignAmounts: true,
      influencerSurveyAmounts: true,
      platformProductOrderInfluencers: true,
    };

    const influencers = await this.prismaService.influencer.findMany({
      where: queryWhere,
      include: queryInclude,
    });

    return influencers?.map((item) => {
      return {
        name: `${item.user.firstName} ${item.user.lastName}`,
        email: item.user.email,
        location: `${item.user.location.name} | ${item.user.location.country.name}`,
        invitedBy: `${item.invitedByUser?.firstName} ${item.invitedByUser?.lastName}`,
        affiliateCode: item.affiliateCode,
        dateOfBirth: item.dateOfBirth,
        stakeholderUsername: item.stakeholders[0]?.socialPlatformUsername,
        stakeholderPlatform: 'Instagram',
        gender: this.handleGender(item.gender),
        ethnicity: item.ethnicity.name,
        diseaseAreas:
          item.influencerDiseaseAreas.length > 0
            ? item.influencerDiseaseAreas
                .map((diseaseArea) => diseaseArea.diseaseArea.name)
                .join(' | ')
            : 'Not Specified',
        campaigns:
          item.campaignInfluencerPerformances.length > 0
            ? item.campaignInfluencerPerformances
                .map((campaign) => campaign.campaign.name)
                .join(' | ')
            : 'Not Specified',
      };
    });
  }

  async exportDiscoverInfluencers(dto: FindByIdsDto) {
    const queryWhere: Prisma.InfluencerWhereInput = {
      user: {
        status: { in: dto.userStatus },
        isDeleted: false,
        id: {
          in: dto.ids,
        },
      },
    };

    const queryInclude = {
      campaignInfluencerPerformances: {
        include: {
          campaign: true,
        },
      },
      ethnicity: true,
      influencerDiseaseAreas: {
        include: {
          diseaseArea: true,
        },
      },
      user: {
        include: {
          location: {
            select: {
              name: true,
              country: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      invitedByUser: true,
      stakeholders: {
        include: {
          campaignLikers: true,
        },
      },
      influencerCampaignAmounts: true,
      influencerSurveyAmounts: true,
      platformProductOrderInfluencers: true,
    };

    const influencers = await this.prismaService.influencer.findMany({
      where: queryWhere,
      include: queryInclude,
    });

    return influencers?.map((item) => {
      return {
        name: `${item.user.firstName} ${item.user.lastName}`,
        email: item.user.email,
        location: `${item.user.location.name} | ${
          item.user.location.country?.name ?? ''
        }`,
        invitedBy: `${item.invitedByUser?.firstName} ${item.invitedByUser?.lastName}`,
        affiliateCode: item.affiliateCode,
        dateOfBirth: item.dateOfBirth,
        stakeholderUsername: item.stakeholders[0]?.socialPlatformUsername,
        stakeholderPlatform: item.stakeholders[0]?.socialPlatformId
          ? 'Instagram'
          : '',
        gender: this.handleGender(item.gender),
        ethnicity: item.ethnicity.name,
        diseaseAreas:
          item.influencerDiseaseAreas.length > 0
            ? item.influencerDiseaseAreas
                .map((diseaseArea) => diseaseArea.diseaseArea.name)
                .join(' | ')
            : 'Not Specified',
        campaigns:
          item.campaignInfluencerPerformances.length > 0
            ? item.campaignInfluencerPerformances
                .map((campaign) => campaign.campaign.name)
                .join(' | ')
            : 'Not Specified',
      };
    });
  }
}
