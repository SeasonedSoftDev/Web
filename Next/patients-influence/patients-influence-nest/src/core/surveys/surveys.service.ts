import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { Status } from '../campaign/enums/status.enum';
import { PlatformProduct } from '../platform-product/enums/platform-product.enum';
import { Currency, UserRole } from 'src/utils';
import { ambassadorCommission } from 'src/config';
import { Influencer, Prisma, User } from '@prisma/client';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import {
  ApplicationException,
  BadRequestApplicationException,
  ForbiddenApplicationException,
  NotFoundApplicationException,
} from 'src/exceptions/application.exception';
import { ProductOrderInfluencerStatus } from '../platform-product/enums/product-order-influencer-status.enum';
import { UserWithInfluencer } from '../influencer/types';
import { userIdentity } from '../users/utils/user-identity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerChoiceDto } from './dto/create-answer-choice.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateAnswerChoiceDto } from './dto/update-answer-choice.dto';
import { SubmitSurveyResultDto } from './dto/submit-survey-result.dto';
import { SurveyFilterDto } from './dto/survey-filter.dto';
import { UserEntity } from '../users/entities/user.entity';
import { CreditPackage } from './enums/credit-package.enum';
import { DeleteManySurveysDto } from './dto/delete-many-surveys.dto';
import { SurveyInviteInfluencers } from './dto/survey-invite-influencers.dto';
import { FinanceStatus } from '../campaign/enums/finance-status.enum';
import { SurveyType } from './enums/survey-type.enum';
import { QuestionType } from './enums/question-type.enum';
import { FilterResponseCriteriaDto } from './dto/filter-response-criteria.dto';
import { InfluencerType } from '../influencer/enums/influencer-type.enum';
import { FindByIdsDto } from '../finance/dto/find-by-ids.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from 'src/integrations/mail/mail.service';

@Injectable()
export class SurveysService {
  private readonly surveyQueryIncludeSingle: Prisma.SurveyInclude = {
    products: {
      select: {
        product: true,
      },
    },
    surveyQuestions: true,
    surveyResponses: true,
    clientSurveyTokenBalances: true,
    exampleImages: true,
    stakeholderTypes: {
      select: {
        stakeholderType: true,
      },
    },
    platformProductOrder: {
      include: {
        platformProductOrderChatRooms: {
          include: {
            productOrderChatRoomMembers: {
              include: {
                user: {
                  include: {
                    influencer: true,
                  },
                },
              },
            },
          },
        },
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
              include: {
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
        platformProductOrderDiseaseAreas: {
          select: {
            diseaseArea: true,
          },
        },
        platformProductOrderEthnicities: {
          select: {
            ethnicity: true,
          },
        },
        platformProductOrderGenders: {
          select: {
            gender: true,
          },
        },
        platformProductOrderInterests: {
          select: {
            interest: true,
          },
        },
        platformProductOrderLocations: {
          select: {
            location: {
              include: {
                country: true,
              },
            },
          },
        },
        platformProductOrderStruggles: {
          select: {
            struggle: true,
          },
        },
        platformProductOrderSymptoms: {
          select: {
            symptom: true,
          },
        },
        platformProductOrderLabels: {
          select: {
            label: true,
          },
        },
        platformProductOrderInfluencers: {
          include: {
            influencer: {
              select: {
                stakeholders: true,
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    currency: true,
                    isDeleted: true,
                    password: false,
                    role: true,
                    status: true,
                  },
                },
                campaignInfluencerPerformances: {
                  select: {
                    submissionLink: true,
                  },
                },
              },
            },
          },
        },
        platformProductOrderLanguages: {
          select: {
            language: true,
          },
        },
      },
    },
  };
  private readonly surveyQueryIncludeMany: Prisma.SurveyInclude = {
    products: true,
    surveyQuestions: true,

    platformProductOrder: {
      include: {
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
          },
        },
        platformProductOrderDiseaseAreas: {
          select: {
            diseaseArea: true,
          },
        },
        platformProductOrderLanguages: {
          select: {
            language: true,
          },
        },
        // markets
        platformProductOrderLocations: {
          select: {
            location: {
              include: {
                country: true,
              },
            },
          },
        },
        // OLD // for count purposes get all influencers, but not their details
        // OLD platformProductOrderInfluencers: true,
        platformProductOrderInfluencers: {
          include: {
            influencer: true,
          },
        },
      },
    },
  };
  private readonly surveyInfluencersQueryInclude: Prisma.PlatformProductOrderInfluencerInclude =
    {
      influencer: {
        include: {
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
    };

  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationsService,
    private readonly mailService: MailService,
  ) {}

  async create(createSurveyDto: CreateSurveyDto, user: UserEntity) {
    const {
      name,
      clientUserId,
      budget,
      currencyId,
      diseaseAreaIds,
      struggleIds,
      symptomIds,
      locationIds,
      languageId,
      ethnicityIds,
      interestIds,
      productIds,
      dateStart,
      dateEnd,
      description,
      participantsCount,
      questionsCount,
      ageMin,
      ageMax,
      genders,
      participantsDescription,
      surveyType,
      exampleImageUrls,
      instructions,
      // tokens,
      questionCredits,
      link,
      languages,
      stakeholderTypes,
    } = createSurveyDto;

    if (user.role === UserRole.Client) {
      // Client decided to comment out tokens for not, keeping token related features for future
      // if (tokens !== undefined) {
      //   // reference: https://bobbyhadz.com/blog/typescript-get-enum-values-as-array
      //   const allowedCreditValues = Object.keys(CreditPackage)
      //     .filter((v) => !isNaN(Number(v)))
      //     .map((v) => parseInt(v));
      //   if (!allowedCreditValues.includes(tokens)) {
      //     throw new BadRequestApplicationException(
      //       `Number of tokens must have one one of the following values: ${allowedCreditValues.join(
      //         ', ',
      //       )}`,
      //     );
      //   }
      // }
      if (questionCredits !== undefined) {
        throw new BadRequestApplicationException(
          `Only the admin can set question credits.`,
        );
      }
    }

    const productNames = productIds
      ? productIds.filter((item) => typeof item === 'string')
      : [];
    const productNumbers = productIds
      ? productIds.filter((item) => typeof item === 'number')
      : [];

    const newProducts = [];

    if (productNames.length > 0) {
      const userPromise = clientUserId
        ? this.prismaService.user.findFirstOrThrow({
            where: {
              id: clientUserId,
            },
            select: {
              client: {
                select: {
                  id: true,
                },
              },
            },
          })
        : Promise.resolve(null);

      const clientUser = await userPromise;

      for (let i = 0; i < productNames.length; i++) {
        const createdByClientId = clientUser?.client.id ?? user.client.id;
        const newProduct = await this.prismaService.product.create({
          data: {
            name: productNames[i].toString(),
            isApproved: false,
            createdByClientId,
          },
        });

        if (newProduct) {
          newProducts.push(newProduct.id);
        }
      }
    }

    const finalProductsIds = [...productNumbers, ...newProducts];

    const clientProductOrders =
      await this.prismaService.platformProductOrder.findMany({
        where: {
          client: {
            userId: user.role === UserRole.Client ? user.id : clientUserId,
          },
        },
      });

    const survey = await this.prismaService.survey.create({
      data: {
        name,
        products: finalProductsIds && {
          createMany: {
            data: finalProductsIds.map((productId) => ({ productId })),
          },
        },
        stakeholderTypes: stakeholderTypes && {
          createMany: {
            data: stakeholderTypes.map((stakeholderType) => ({
              stakeholderType,
            })),
          },
        },
        language: languageId,
        dateStart,
        dateEnd,
        surveyDescription: description,
        participantCount: participantsCount,
        questionCount: questionsCount,
        ageMin,
        ageMax,
        participantsDescription,
        surveyType,
        exampleImages: exampleImageUrls && {
          createMany: {
            data: exampleImageUrls.map((imageUrl) => ({ imageUrl })),
          },
        },
        instructionsDescription: instructions,
        questionCredits,
        link,
        // clientSurveyTokenBalances: {
        //   create: {
        //     tokenBalance: tokens,
        //   },
        // },
        platformProductOrder: {
          create: {
            platformProduct: PlatformProduct.Survey,
            financeStatus: budget && FinanceStatus.Pending,
            client: {
              connect: {
                userId: user.role === UserRole.Client ? user.id : clientUserId,
              },
            },
            ambassadorCommission: ambassadorCommission,
            budget,
            currency: {
              connect: {
                id: currencyId ? currencyId : 1,
              },
            },
            platformProductOrderDiseaseAreas: diseaseAreaIds && {
              createMany: {
                data: diseaseAreaIds.map((diseaseAreaId) => ({
                  diseaseAreaId,
                })),
              },
            },
            platformProductOrderStruggles: struggleIds && {
              createMany: {
                data: struggleIds.map((struggleId) => ({ struggleId })),
              },
            },
            platformProductOrderSymptoms: symptomIds && {
              createMany: {
                data: symptomIds.map((symptomId) => ({ symptomId })),
              },
            },
            platformProductOrderLocations: locationIds && {
              createMany: {
                data: locationIds.map((locationId) => ({ locationId })),
              },
            },
            platformProductOrderEthnicities: ethnicityIds && {
              // create: { ethnicityId },
              createMany: {
                data: ethnicityIds.map((ethnicityId) => ({ ethnicityId })),
              },
            },
            platformProductOrderInterests: interestIds && {
              createMany: {
                data: interestIds.map((interestId) => ({ interestId })),
              },
            },
            platformProductOrderGenders: genders && {
              createMany: { data: genders.map((gender) => ({ gender })) },
            },
            platformProductOrderLanguages: languages && {
              createMany: {
                data: languages.map((language) => ({ language })),
              },
            },
            status: Status.InPreparation,
          },
        },
      },
      include: {
        ...this.surveyQueryIncludeSingle,
      },
    });

    if (
      survey &&
      user.role === UserRole.Client &&
      !clientProductOrders.length
    ) {
      await this.notificationService.clientOrderCreated(
        user.id,
        `${user.firstName} ${user.lastName}`,
        survey.platformProductOrderId,
      );
    }

    if (survey && user.role === UserRole.Client && clientProductOrders) {
      await this.notificationService.surveyCreated(
        user.id,
        survey.id,
        `${user.firstName} ${user.lastName}`,
      );
    }

    return survey;
  }

  async findAll(
    { skip, take, sortBy }: FilterParamsDto,
    filters: SurveyFilterDto,
    user: UserEntity,
  ) {
    let queryWhere: Prisma.SurveyWhereInput = {
      OR:
        filters.search && filters.search.length
          ? [
              {
                name: {
                  contains: filters.search,
                  mode: 'insensitive',
                },
              },
              {
                name: {
                  contains: filters.search,
                  mode: 'insensitive',
                },
              },
              {
                platformProductOrder: {
                  client: {
                    user: {
                      firstName: {
                        contains: filters.search,
                        mode: 'insensitive',
                      },
                      lastName: {
                        contains: filters.search,
                        mode: 'insensitive',
                      },
                    },
                  },
                },
              },
              {
                platformProductOrder: {
                  client: {
                    user: {
                      AND: [
                        {
                          firstName: {
                            contains: filters.search.split(' ')[0], // filters.Search for the first part of the full name
                            mode: 'insensitive',
                          },
                        },
                        {
                          lastName: {
                            contains: filters.search.split(' ')[1], // filters.Search for the second part of the full name
                            mode: 'insensitive',
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                platformProductOrder: {
                  platformProductOrderDiseaseAreas: {
                    some: {
                      diseaseArea: {
                        name: {
                          contains: filters.search,
                          mode: 'insensitive',
                        },
                      },
                    },
                  },
                },
              },
              {
                platformProductOrder: {
                  platformProductOrderLocations: {
                    some: {
                      location: {
                        name: {
                          contains: filters.search,
                          mode: 'insensitive',
                        },
                      },
                    },
                  },
                },
              },
              {
                platformProductOrder: {
                  platformProductOrderLocations: {
                    some: {
                      location: {
                        country: {
                          name: {
                            contains: filters.search,
                            mode: 'insensitive',
                          },
                        },
                      },
                    },
                  },
                },
              },
              {
                products: {
                  some: {
                    product: {
                      name: {
                        contains: filters.search,
                        mode: 'insensitive',
                      },
                    },
                  },
                },
              },
            ]
          : undefined,
      dateStart: filters.startDate
        ? {
            gte: filters.startDate,
          }
        : undefined,
      dateEnd: filters.endDate
        ? {
            lte: filters.endDate,
          }
        : undefined,
      surveyType:
        filters.surveyType || filters.surveyType === 0
          ? filters.surveyType
          : undefined,
      products: filters.productIds?.length
        ? {
            some: {
              productId: filters.productIds?.length
                ? { in: filters.productIds }
                : undefined,
            },
          }
        : undefined,
      platformProductOrder: {
        platformProductOrderLanguages:
          filters.targetLanguageIds && filters.targetLanguageIds.length
            ? {
                some: {
                  language: {
                    in: filters.targetLanguageIds,
                  },
                },
              }
            : undefined,
        platformProductOrderGenders:
          filters.targetGenderIds && filters.targetGenderIds.length
            ? {
                some: {
                  gender: {
                    in: filters.targetGenderIds,
                  },
                },
              }
            : undefined,
        platformProductOrderStruggles:
          filters.targetStruggleIds && filters.targetStruggleIds.length
            ? {
                some: {
                  struggleId: {
                    in: filters.targetStruggleIds,
                  },
                },
              }
            : undefined,
        platformProductOrderDiseaseAreas:
          filters.targetDiseaseAreaIds && filters.targetDiseaseAreaIds.length
            ? {
                some: {
                  diseaseAreaId: {
                    in: filters.targetDiseaseAreaIds,
                  },
                },
              }
            : undefined,
        platformProductOrderLocations:
          filters.targetLocationIds && filters.targetLocationIds.length
            ? {
                some: {
                  OR: [
                    {
                      locationId: {
                        in: filters.targetLocationIds,
                      },
                    },
                    {
                      location: {
                        countryId: {
                          in: filters.targetLocationIds,
                        },
                      },
                    },
                  ],
                },
              }
            : undefined,
        platformProductOrderEthnicities:
          filters.targetEthnicityIds && filters.targetEthnicityIds.length
            ? {
                some: {
                  ethnicityId: {
                    in: filters.targetEthnicityIds,
                  },
                },
              }
            : undefined,
        platformProductOrderInterests:
          filters.targetInterestIds && filters.targetInterestIds.length
            ? {
                some: {
                  interestId: {
                    in: filters.targetInterestIds,
                  },
                },
              }
            : undefined,
        status:
          filters.status && filters.status.length
            ? { in: filters.status.map(Number) }
            : undefined,
        client:
          user.role !== UserRole.Influencer
            ? {
                OR: filters.clientIds?.length
                  ? [
                      {
                        userId: {
                          in: filters.clientIds,
                        },
                      },
                    ]
                  : undefined,
                industryId: filters.clientIndustryIds
                  ? { in: filters.clientIndustryIds }
                  : undefined,
                // clientDiseaseAreas: filters.clientDiseaseAreaIds?.length
                //   ? {
                //       some: {
                //         diseaseArea: {
                //           id: filters.clientDiseaseAreaIds?.length
                //             ? { in: filters.clientDiseaseAreaIds }
                //             : undefined,
                //         },
                //       },
                //     }
                //   : undefined,
                ambassador: filters.ambassadorId
                  ? {
                      userId: filters.ambassadorId,
                    }
                  : undefined,
                // products: filters.productIds?.length
                //   ? {
                //       some: {
                //         id: filters.productIds?.length
                //           ? { in: filters.productIds }
                //           : undefined,
                //       },
                //     }
                //   : undefined,
                company: filters.clientCompanyIds?.length
                  ? { id: { in: filters.clientCompanyIds } }
                  : undefined,
              }
            : undefined,
      },
    };
    const queryOrderBy: Prisma.Enumerable<Prisma.SurveyOrderByWithRelationInput> =
      (sortBy as any) || { createdAt: 'desc' };

    if (user.role === UserRole.Client) {
      queryWhere = {
        ...queryWhere,
        platformProductOrder: {
          client: {
            userId: user.id,
          },
          status:
            filters.status && filters.status.length
              ? { in: filters.status.map(Number) }
              : undefined,
        },
      };
    } else if (user.role === UserRole.Influencer) {
      queryWhere = {
        ...queryWhere,
        platformProductOrder: {
          status: queryWhere.platformProductOrder.status,
          platformProductOrderInfluencers: {
            some: {
              influencerId: user.influencer.id,
              status: {
                in: [
                  ProductOrderInfluencerStatus.Invited,
                  ProductOrderInfluencerStatus.Matching,
                  ProductOrderInfluencerStatus.Withdrawn,
                  ProductOrderInfluencerStatus.ToBeAnswered,
                  ProductOrderInfluencerStatus.ToBeApproved,
                  ProductOrderInfluencerStatus.Approved,
                  ProductOrderInfluencerStatus.NotApproved,
                ],
              },
            },
          },
        },
      };
    }

    const surveysForMinMaxFiltering = await this.prismaService.survey.findMany({
      where: queryWhere,
      select: {
        id: true,
        ageMin: true,
        ageMax: true,
        questionCount: true,
        questionCredits: true,
        participantCount: true,
        platformProductOrder: {
          select: {
            budget: true,
          },
        },
      },
    });

    const surveyFilterIds = surveysForMinMaxFiltering
      .filter((survey) => {
        let isMatch = true;

        if (
          filters.budgetMin !== undefined &&
          filters.budgetMax === undefined
        ) {
          isMatch &&=
            survey.platformProductOrder.budget.toNumber() >= filters.budgetMin;
        }

        if (
          filters.budgetMin === undefined &&
          filters.budgetMax !== undefined
        ) {
          isMatch &&=
            survey.platformProductOrder.budget.toNumber() <= filters.budgetMax;
        }

        if (
          filters.budgetMin !== undefined &&
          filters.budgetMax !== undefined
        ) {
          isMatch &&=
            survey.platformProductOrder.budget.toNumber() >=
              filters.budgetMin &&
            survey.platformProductOrder.budget.toNumber() <= filters.budgetMax;
        }

        if (
          filters.participantsMin !== undefined &&
          filters.participantsMax === undefined
        ) {
          isMatch &&= survey.participantCount >= filters.participantsMin;
        }

        if (
          filters.participantsMin === undefined &&
          filters.participantsMax !== undefined
        ) {
          isMatch &&= survey.participantCount <= filters.participantsMax;
        }

        if (
          filters.participantsMin !== undefined &&
          filters.participantsMax !== undefined
        ) {
          isMatch &&=
            survey.participantCount >= filters.participantsMin &&
            survey.participantCount <= filters.participantsMax;
        }

        if (
          filters.questionsMin !== undefined &&
          filters.questionsMax === undefined
        ) {
          isMatch &&= survey.questionCount >= filters.questionsMin;
        }

        if (
          filters.questionsMin === undefined &&
          filters.questionsMax !== undefined
        ) {
          isMatch &&= survey.questionCount <= filters.questionsMax;
        }

        if (
          filters.questionsMin !== undefined &&
          filters.questionsMax !== undefined
        ) {
          isMatch &&=
            survey.questionCount >= filters.questionsMin &&
            survey.questionCount <= filters.questionsMax;
        }

        if (
          filters.questionCreditMin !== undefined &&
          filters.questionCreditMax === undefined
        ) {
          isMatch &&= survey.questionCredits >= filters.questionCreditMin;
        }

        if (
          filters.questionCreditMin === undefined &&
          filters.questionCreditMax !== undefined
        ) {
          isMatch &&= survey.questionCredits <= filters.questionCreditMax;
        }

        if (
          filters.questionCreditMin !== undefined &&
          filters.questionCreditMax !== undefined
        ) {
          isMatch &&=
            survey.questionCredits >= filters.questionCreditMin &&
            survey.questionCredits <= filters.questionCreditMax;
        }

        if (
          filters.targetAgeMin !== undefined &&
          filters.targetAgeMax === undefined
        ) {
          isMatch &&= survey.ageMin >= filters.targetAgeMin;
        }

        if (
          filters.targetAgeMin === undefined &&
          filters.targetAgeMax !== undefined
        ) {
          isMatch &&= survey.ageMax <= filters.targetAgeMax;
        }

        if (
          filters.targetAgeMin !== undefined &&
          filters.targetAgeMax !== undefined
        ) {
          isMatch &&=
            survey.ageMin >= filters.targetAgeMin &&
            survey.ageMax <= filters.targetAgeMax;
        }

        return isMatch;
      })
      .map((survey) => survey.id);

    const queryInfluencerSelect: Prisma.SurveySelect = {
      dateStart: true,
      dateEnd: true,
      exampleImages: true,
      name: true,
      id: true,
      platformProductOrderId: true,
      questionCount: true,
      link: true,
      surveyType: true,
      products: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              genericName: true,
            },
          },
        },
      },
      platformProductOrder: {
        select: {
          clientId: true,
          status: true,
          client: {
            select: {
              id: true,
              clientProducts: true,
              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          platformProduct: true,
          platformProductOrderLanguages: true,
          platformProductOrderInfluencers: {
            where: {
              influencerId:
                user.role === UserRole.Influencer
                  ? user.influencer.id
                  : undefined,
              status: {
                in: [
                  ProductOrderInfluencerStatus.Invited,
                  ProductOrderInfluencerStatus.Matching,
                  ProductOrderInfluencerStatus.Withdrawn,
                  ProductOrderInfluencerStatus.ToBeAnswered,
                  ProductOrderInfluencerStatus.ToBeApproved,
                  ProductOrderInfluencerStatus.Approved,
                  ProductOrderInfluencerStatus.NotApproved,
                ],
              },
            },
          },
        },
      },
    };
    queryWhere.id = { in: surveyFilterIds };
    const response = await filterRecordsFactory(
      this.prismaService,
      (tx) => tx.survey,
      {
        where: queryWhere,
        include:
          user.role === UserRole.Influencer
            ? undefined
            : this.surveyQueryIncludeMany,
        select:
          user.role === UserRole.Influencer ? queryInfluencerSelect : undefined,
        skip,
        take,
        orderBy: queryOrderBy,
      },
    )();

    return response;
  }

  async findOne(id: number, user: UserEntity) {
    if (user.role === UserRole.Influencer) {
      throw new UnauthorizedException(
        'Influencers cannot access this endpoint',
      );
    }
    return await this.prismaService.survey.findUniqueOrThrow({
      where: { id },
      include: {
        ...this.surveyQueryIncludeSingle,
      },
    });
  }

  async findOneInfluencersSurvey(
    id: number,
    user: UserEntity,
    influencerId: number,
  ) {
    if (influencerId && user.role !== UserRole.Influencer) {
      const influencer = await this.prismaService.influencer.findUnique({
        where: {
          id: influencerId,
        },
        select: {
          id: true,
          userId: true,
        },
      });

      return await this.prismaService.survey.findUniqueOrThrow({
        where: { id },
        select: {
          name: true,
          id: true,
          products: false,
          clientSurveyTokenBalances: false,
          surveyQuestions: true,
          exampleImages: false,
          notificationPayload: false,
          platformProductOrder: {
            select: {
              id: true,
              platformProductOrderInfluencers: {
                where: {
                  influencerId: influencer.id,
                },
                select: {
                  id: true,
                  influencerId: true,
                  status: true,
                },
              },
            },
          },
          surveyResponses: {
            where: {
              userId: influencer.userId,
            },
            include: {
              surveyOption: {
                select: {
                  surveyQuestion: {
                    select: {
                      questionType: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }
    return await this.prismaService.survey.findUniqueOrThrow({
      where: { id },
      select: {
        name: true,
        id: true,
        products: false,
        clientSurveyTokenBalances: false,
        surveyQuestions: true,
        exampleImages: false,
        notificationPayload: false,
        platformProductOrder: {
          select: {
            id: true,
            platformProductOrderInfluencers: {
              where: {
                influencerId: influencerId || user.influencer.id,
              },
              select: {
                id: true,
                influencerId: true,
                status: true,
              },
            },
          },
        },
        surveyResponses: {
          where: {
            userId: user.id,
          },
          include: {
            surveyOption: {
              select: {
                surveyQuestion: {
                  select: {
                    questionType: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, updateSurveyDto: UpdateSurveyDto, user: UserEntity) {
    const {
      name,
      budget,
      currencyId,
      clientUserId,
      diseaseAreaIds,
      struggleIds,
      symptomIds,
      locationIds,
      languages,
      ethnicityIds,
      interestIds,
      productIds,
      dateStart,
      dateEnd,
      description,
      participantsCount,
      questionsCount,
      ageMin,
      ageMax,
      genders,
      participantsDescription,
      surveyType,
      exampleImageUrls,
      instructions,
      // tokens,
      questionCredits,
      link,
      status,
      stakeholderTypes,
    } = updateSurveyDto;

    if (user.role === UserRole.Client) {
      if (status !== undefined) {
        // TODO handle with CASL
        throw new ApplicationException(`Can't update status`);
      } else if (questionCredits !== undefined) {
        throw new BadRequestApplicationException(
          `Only the admin can set question credits.`,
        );
      }
    }

    const {
      participantCount: participantCountOld,
      questionCredits: questionCreditsOld,
      platformProductOrderId,
      platformProductOrder: { budget: budgetOld, status: statusOld },
      clientSurveyTokenBalances,
    } = await this.prismaService.survey.findUniqueOrThrow({
      where: { id },
      select: {
        participantCount: true,
        questionCredits: true,
        platformProductOrderId: true,
        platformProductOrder: {
          select: { id: true, budget: true, status: true },
        },
        clientSurveyTokenBalances: true,
      },
    });

    const productNames = productIds.filter((item) => typeof item === 'string');
    const productNumbers = productIds.filter(
      (item) => typeof item === 'number',
    );
    const newProducts = [];

    if (productNames.length > 0) {
      const userPromise = clientUserId
        ? this.prismaService.user.findFirstOrThrow({
            where: {
              id: clientUserId,
            },
            select: {
              client: {
                select: {
                  id: true,
                },
              },
            },
          })
        : Promise.resolve(null);

      const clientUser = await userPromise;

      for (let i = 0; i < productNames.length; i++) {
        const createdByClientId = clientUser?.client.id ?? user.client.id;
        const newProduct = await this.prismaService.product.create({
          data: {
            name: productNames[i].toString(),
            isApproved: false,
            createdByClientId,
          },
        });

        if (newProduct) {
          newProducts.push(newProduct.id);
        }
      }
    }

    const finalProductsIds = [...productNumbers, ...newProducts];

    const clientTokenBalance =
      clientSurveyTokenBalances && clientSurveyTokenBalances.length
        ? clientSurveyTokenBalances[0]
        : undefined;

    if (
      statusOld !== Status.InPreparation &&
      Object.keys(updateSurveyDto).some(
        (property) => updateSurveyDto[property] !== undefined,
      )
    ) {
      throw new ApplicationException(
        `Can't update survey that is on-going or finished`,
      );
    } else if (budgetOld > budget && user.role === UserRole.Client) {
      // TODO handle with CASL
      throw new ApplicationException(`Can't put budget below current amount`);
    } else if (
      participantCountOld > participantsCount &&
      user.role === UserRole.Client
    ) {
      // TODO handle with CASL
      throw new ApplicationException(
        `Can't put the number of influencers below current number`,
      );
    } else if (
      questionCreditsOld > questionCredits &&
      user.role === UserRole.Client
    ) {
      // TODO handle with CASL
      throw new ApplicationException(
        `Can't put the number of question credits below current number`,
      );
    }

    const survey = await this.prismaService.survey.update({
      where: { id },
      data: {
        name,
        products: finalProductsIds && {
          deleteMany: {
            surveyId: id,
            productId: { notIn: finalProductsIds },
          },
          upsert: finalProductsIds.map((productId) => ({
            create: { productId },
            update: { productId },
            where: {
              SurveyProductIdentifier: {
                surveyId: id,
                productId,
              },
            },
          })),
        },
        stakeholderTypes: stakeholderTypes && {
          deleteMany: {
            surveyId: id,
            stakeholderType: { notIn: stakeholderTypes },
          },
          upsert: stakeholderTypes.map((stakeholderType) => ({
            create: { stakeholderType },
            update: { stakeholderType },
            where: {
              SurveyStakeholderTypeIdentifier: {
                surveyId: id,
                stakeholderType,
              },
            },
          })),
        },
        // language: languageId,
        dateStart,
        dateEnd,
        surveyDescription: description,
        participantCount: participantsCount,
        questionCount: questionsCount,
        ageMin,
        ageMax,
        participantsDescription,
        surveyType,
        link,
        exampleImages: exampleImageUrls && {
          deleteMany: {
            surveyId: id,
            imageUrl: { notIn: exampleImageUrls },
          },
          upsert: exampleImageUrls.map((imageUrl) => ({
            create: { imageUrl },
            update: { imageUrl },
            where: {
              SurveyExampleImageIdentifier: {
                surveyId: id,
                imageUrl,
              },
            },
          })),
        },
        // clientSurveyTokenBalances: {
        //   update: {
        //     where: {
        //       id: clientTokenBalance.id,
        //     },
        //     data: {
        //       tokenBalance: tokens,
        //     },
        //   },
        // },
        instructionsDescription: instructions,
        platformProductOrder: {
          update: {
            ambassadorCommission: ambassadorCommission,
            budget, // TODO client musn't be able to update budget to lower value
            platformProductOrderDiseaseAreas: diseaseAreaIds && {
              deleteMany: {
                productOrderId: platformProductOrderId,
                diseaseAreaId: { notIn: diseaseAreaIds },
              },
              upsert: diseaseAreaIds.map((diseaseAreaId) => ({
                create: { diseaseAreaId },
                update: { diseaseAreaId },
                where: {
                  productOrderId_diseaseAreaId: {
                    productOrderId: platformProductOrderId,
                    diseaseAreaId,
                  },
                },
              })),
            },
            platformProductOrderStruggles: struggleIds && {
              deleteMany: {
                productOrderId: platformProductOrderId,
                struggleId: { notIn: struggleIds },
              },
              upsert: struggleIds.map((struggleId) => ({
                create: { struggleId },
                update: { struggleId },
                where: {
                  productOrderId_struggleId: {
                    productOrderId: platformProductOrderId,
                    struggleId,
                  },
                },
              })),
            },
            platformProductOrderSymptoms: symptomIds && {
              deleteMany: {
                productOrderId: platformProductOrderId,
                symptomId: { notIn: symptomIds },
              },
              upsert: symptomIds.map((symptomId) => ({
                create: { symptomId },
                update: { symptomId },
                where: {
                  productOrderId_symptomId: {
                    productOrderId: platformProductOrderId,
                    symptomId,
                  },
                },
              })),
            },
            platformProductOrderLocations: locationIds && {
              deleteMany: {
                productOrderId: platformProductOrderId,
                locationId: { notIn: locationIds },
              },
              upsert: locationIds.map((locationId) => ({
                create: { locationId },
                update: { locationId },
                where: {
                  productOrderId_locationId: {
                    productOrderId: platformProductOrderId,
                    locationId,
                  },
                },
              })),
            },
            platformProductOrderEthnicities: ethnicityIds && {
              deleteMany: {
                productOrderId: platformProductOrderId,
                ethnicityId: { notIn: ethnicityIds },
              },
              upsert: ethnicityIds.map((ethnicityId) => ({
                create: { ethnicityId },
                update: { ethnicityId },
                where: {
                  productOrderId_ethnicityId: {
                    productOrderId: platformProductOrderId,
                    ethnicityId,
                  },
                },
              })),
            },
            platformProductOrderInterests: interestIds && {
              deleteMany: {
                productOrderId: platformProductOrderId,
                interestId: { notIn: interestIds },
              },
              upsert: interestIds.map((interestId) => ({
                create: { interestId },
                update: { interestId },
                where: {
                  productOrderId_interestId: {
                    productOrderId: platformProductOrderId,
                    interestId,
                  },
                },
              })),
            },
            platformProductOrderLanguages: languages && {
              deleteMany: {
                productOrderId: platformProductOrderId,
                language: { notIn: languages },
              },
              upsert: languages.map((language) => ({
                create: { language },
                update: { language },
                where: {
                  productOrderId_language: {
                    productOrderId: platformProductOrderId,
                    language,
                  },
                },
              })),
            },
            platformProductOrderGenders: genders && {
              deleteMany: {
                productOrderId: platformProductOrderId,
                gender: { notIn: genders },
              },
              upsert: genders.map((gender) => ({
                create: { gender },
                update: { gender },
                where: {
                  productOrderId_gender: {
                    productOrderId: platformProductOrderId,
                    gender,
                  },
                },
              })),
            },
            status,
          },
        },
      },
      include: {
        ...this.surveyQueryIncludeSingle,
      },
    });

    return survey;
  }

  async remove(id: number) {
    return await this.prismaService.$transaction(async (tx) => {
      const survey = await tx.survey.findUnique({
        where: {
          id,
        },
        select: {
          platformProductOrder: {
            select: {
              id: true,
            },
          },
        },
      });

      const deletedSurvey = await tx.survey.delete({
        where: { id },
      });

      if (survey) {
        await tx.platformProductOrder.delete({
          where: { id: survey.platformProductOrder.id },
        });
      }

      return deletedSurvey;
    });
  }

  async removeManySurveys(dto: DeleteManySurveysDto) {
    const { surveyIds } = dto;

    return await this.prismaService.$transaction(async (tx) => {
      const existingSurveys = await tx.survey.findMany({
        where: {
          id: { in: surveyIds },
        },
        select: {
          id: true,
          platformProductOrderId: true,
        },
      });

      const existingSurveyIds = existingSurveys.map((survey) => survey.id);

      const existingSurveyProductIds = existingSurveys.map(
        (survey) => survey.platformProductOrderId,
      );
      const missingSurveyIds = surveyIds.filter(
        (surveyId) => !existingSurveyIds.includes(surveyId),
      );

      if (missingSurveyIds.length > 0) {
        throw new NotFoundException(
          `Surveys with IDs ${missingSurveyIds.join(', ')} not found.`,
        );
      }

      const deletedSurveys = await tx.survey.deleteMany({
        where: {
          id: {
            in: surveyIds,
          },
        },
      });

      if (existingSurveyProductIds.length) {
        await tx.platformProductOrder.deleteMany({
          where: {
            id: {
              in: existingSurveyProductIds,
            },
          },
        });
      }

      return deletedSurveys;
    });
  }

  //#region INFLUENCER ONBOARD
  async addInfluencers(
    surveyId: number,
    influencerIds: number[],
    user: UserEntity,
  ) {
    if (user.role !== UserRole.SuperAdmin) {
      throw new ForbiddenApplicationException(
        'You are not authorised to add influencers',
      );
    }
    const survey = await this.prismaService.survey.findUniqueOrThrow({
      where: { id: surveyId },
      select: {
        platformProductOrderId: true,
        platformProductOrder: true,
        surveyType: true,
      },
    });

    // ! if influencers FOR EXAMPLE failed in some scenario, there has to be
    // ! a way to add a new influencers instead old ones
    if (survey.platformProductOrder.status >= Status.Finished) {
      throw new ForbiddenApplicationException(
        `Can't add influencer/s after the survey has finished`,
      );
    } else if ([undefined, null].includes(survey.surveyType)) {
      throw new BadRequestApplicationException(
        `Survey has to have survey type defined`,
      );
    }

    const userInfluencers = await this.prismaService.user.findMany({
      where: { id: { in: influencerIds } },
      select: {
        id: true,
        currency: true,
        influencer: {
          select: {
            id: true,
            influencerSurveyAmounts: {
              // it is expected for an influencer to have these settings defined
              where: { surveyType: survey.surveyType },
            },
          },
        },
      },
    });

    const userInfluencersNotExist = influencerIds.filter(
      (influencerId) =>
        !userInfluencers.find(
          (userInfluencer) => userInfluencer.id === influencerId,
        ),
    );

    if (userInfluencersNotExist.length) {
      throw new NotFoundApplicationException(
        userInfluencersNotExist.length === 1
          ? `Influencer ${userInfluencersNotExist[0]} does not exist`
          : `Influencers ${userInfluencersNotExist.join(', ')} do not exist`,
      );
    }

    return await Promise.all(
      userInfluencers.map((userInfluencer) =>
        this.prismaService.platformProductOrderInfluencer.upsert({
          create: {
            productOrderId: survey.platformProductOrderId,
            influencerId: userInfluencer.influencer.id,
            agreedAmount:
              userInfluencer.influencer.influencerSurveyAmounts[0]
                .desiredAmount,
            currency: userInfluencer.currency,
            status: ProductOrderInfluencerStatus.Added,
          },
          update: {
            // update agreed amount and currency only, if an influencer is already added
            agreedAmount:
              userInfluencer.influencer.influencerSurveyAmounts[0]
                .desiredAmount,
            currency: userInfluencer.currency,
          },
          where: {
            PlatformProductOrderInfluencerIdentifier: {
              productOrderId: survey.platformProductOrderId,
              influencerId: userInfluencer.influencer.id,
            },
          },
        }),
      ),
    );
  }

  async inviteInfluencers(
    surveyId: number,
    dto: SurveyInviteInfluencers,
    user: UserEntity,
  ) {
    if (user.role !== UserRole.SuperAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to use this feature',
      );
    }
    const { influencerIds } = dto;
    const survey = await this.prismaService.survey.findUniqueOrThrow({
      where: { id: surveyId },
      select: {
        id: true,
        platformProductOrderId: true,
        name: true,
        platformProductOrder: {
          select: {
            id: true,
            platformProductOrderInfluencers: {
              where: { influencer: { id: { in: influencerIds } } },
              select: {
                id: true,
                status: true,
                influencer: {
                  select: {
                    id: true,
                    userId: true,
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
            status: true,
          },
        },
      },
    });

    const surveyInfluencers =
      survey.platformProductOrder.platformProductOrderInfluencers;
    const userInfluencersNotInSurvey = influencerIds.filter(
      (influencerId) =>
        !surveyInfluencers.find(
          (surveyInfluencer) => surveyInfluencer.influencer.id === influencerId,
        ),
    );
    // check if influencers that are not added or not previously invited, are invited
    // * if the influencer is previously invited, this should trigger repeated invitation
    const surveyInfluencersWithInvalidStatus = surveyInfluencers.filter(
      (surveyInfluencer) =>
        ![
          ProductOrderInfluencerStatus.Added,
          ProductOrderInfluencerStatus.Invited,
        ].includes(surveyInfluencer.status),
    );

    if (userInfluencersNotInSurvey.length) {
      throw new BadRequestApplicationException(
        userInfluencersNotInSurvey.length === 1
          ? `Influencer ${userInfluencersNotInSurvey[0]} is not in the survey ${surveyId}`
          : `Influencers ${userInfluencersNotInSurvey.join(
              ', ',
            )} are not in the survey ${surveyId}`,
      );
    } else if (surveyInfluencersWithInvalidStatus.length) {
      throw new BadRequestApplicationException(
        surveyInfluencersWithInvalidStatus.length === 1
          ? `Influencer ${surveyInfluencersWithInvalidStatus[0]} doesn't have valid state to be invited`
          : `Influencers ${surveyInfluencersWithInvalidStatus.join(
              ', ',
            )} don't have valid state to be invited`,
      );
    }

    const invitedInfluencersToSurvey = await Promise.all(
      surveyInfluencers.map((surveyInfluencer) =>
        this.prismaService.platformProductOrderInfluencer.update({
          data: { status: ProductOrderInfluencerStatus.Invited },
          where: {
            id: surveyInfluencer.id,
          },
        }),
      ),
    );

    if (invitedInfluencersToSurvey.every((result) => result !== null)) {
      const influencerUserIds = surveyInfluencers.map(
        (influencer) => influencer.influencer.userId,
      );
      await this.notificationService.surveyInfluencerInvited(
        influencerUserIds,
        survey.id,
      );

      surveyInfluencers.forEach(async (influencer) => {
        const { email, firstName } = influencer.influencer.user;
        const content = `We're thrilled to share that you've been invited to participate in a new survey. This is an exciting opportunity to further your influence and make a real difference. We truly appreciate your ongoing commitment and are eager to see your contributions in this campaign.`;
        await this.mailService.sendNotificationToInfluencer(
          email,
          firstName,
          content,
        );
      });
    }

    return invitedInfluencersToSurvey;
  }

  async acceptInvitation(surveyId: number, user: UserWithInfluencer) {
    if (!user.influencer) {
      throw new BadRequestApplicationException(
        `User ${userIdentity(user)} is not an influencer`,
      );
    }

    const survey = await this.prismaService.survey.findUniqueOrThrow({
      where: { id: surveyId },
      select: {
        id: true,
        name: true,
        platformProductOrderId: true,
        platformProductOrder: {
          select: {
            id: true,
            platformProductOrderInfluencers: {
              where: { influencerId: user.influencer.id },
              include: {
                influencer: {
                  select: {
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                      },
                    },
                  },
                },
              },
            },
            status: true,
            client: true,
          },
        },
      },
    });

    const surveyInfluencer =
      survey.platformProductOrder.platformProductOrderInfluencers[0];

    if (!surveyInfluencer) {
      throw new BadRequestApplicationException(
        `Influencer ${userIdentity(user)} is not in the survey ${surveyId}`,
      );
    } else if (
      surveyInfluencer.status !== ProductOrderInfluencerStatus.Invited
    ) {
      throw new BadRequestApplicationException(
        `Influencer ${userIdentity(user)} is not invited`,
      );
    }

    const membersMap = [
      {
        userId: 1,
      },
      {
        userId: user.id,
      },
    ];

    await this.prismaService.platformProductOrderChatRoom.create({
      data: {
        isGroupRoom: true,
        productOrderId: survey.platformProductOrderId,
        productOrderChatRoomMembers: {
          createMany: { data: membersMap },
        },
      },
    });

    const updatedPlatformInfluencer =
      await this.prismaService.platformProductOrderInfluencer.update({
        // * next state is different than in a campaign
        data: { status: ProductOrderInfluencerStatus.ToBeAnswered },
        where: {
          id: surveyInfluencer.id,
        },
      });

    if (updatedPlatformInfluencer) {
      await this.notificationService.surveyInfluencerInviteAccepted(
        surveyInfluencer.influencer.user.id,
        survey.id,
        `${surveyInfluencer.influencer.user.firstName} ${surveyInfluencer.influencer.user.lastName}`,
        survey.name,
      );
    }

    return updatedPlatformInfluencer;
  }

  async declineInvitation(surveyId: number, user: UserWithInfluencer) {
    if (!user.influencer) {
      throw new BadRequestApplicationException(
        `User ${userIdentity(user)} is not an influencer`,
      );
    }

    const survey = await this.prismaService.survey.findUniqueOrThrow({
      where: { id: surveyId },
      select: {
        id: true,
        name: true,
        platformProductOrderId: true,
        platformProductOrder: {
          select: {
            id: true,
            platformProductOrderInfluencers: {
              where: { influencerId: user.influencer.id },
              include: {
                influencer: {
                  select: {
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                      },
                    },
                  },
                },
              },
            },
            status: true,
          },
        },
      },
    });

    const surveyInfluencer =
      survey.platformProductOrder.platformProductOrderInfluencers[0];

    if (!surveyInfluencer) {
      throw new BadRequestApplicationException(
        `Influencer ${userIdentity(user)} is not in the survey ${surveyId}`,
      );
    } else if (
      surveyInfluencer.status !== ProductOrderInfluencerStatus.Invited
    ) {
      throw new BadRequestApplicationException(
        `Influencer ${userIdentity(user)} is not invited`,
      );
    }

    const updatedPlatformInfluencer =
      await this.prismaService.platformProductOrderInfluencer.update({
        data: { status: ProductOrderInfluencerStatus.Declined },
        where: {
          id: surveyInfluencer.id,
        },
      });

    if (updatedPlatformInfluencer) {
      await this.notificationService.surveyInfluencerInviteDeclined(
        surveyInfluencer.influencer.user.id,
        survey.id,
        `${surveyInfluencer.influencer.user.firstName} ${surveyInfluencer.influencer.user.lastName}`,
        survey.name,
      );
    }

    return updatedPlatformInfluencer;
  }
  //#endregion

  //#region INFLUENCER REMOVAL
  async removeInfluencers(surveyId: number, influencerIds: number[]) {
    const survey = await this.prismaService.survey.findUniqueOrThrow({
      where: { id: surveyId },
      select: {
        id: true,
        name: true,
        platformProductOrderId: true,
        platformProductOrder: {
          select: {
            id: true,
            platformProductOrderInfluencers: {
              where: { influencer: { id: { in: influencerIds } } },
              select: {
                id: true,
                status: true,
                influencer: {
                  select: {
                    id: true,
                    userId: true,
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
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
    const surveyInfluencers =
      survey.platformProductOrder.platformProductOrderInfluencers;
    const userInfluencersNotInSurvey = influencerIds.filter(
      (influencerId) =>
        !surveyInfluencers.find(
          (surveyInfluencer) => surveyInfluencer.influencer.id === influencerId,
        ),
    );

    if (userInfluencersNotInSurvey.length) {
      throw new BadRequestApplicationException(
        userInfluencersNotInSurvey.length === 1
          ? `Influencer ${userInfluencersNotInSurvey[0]} is not in the survey ${surveyId}`
          : `Influencers ${userInfluencersNotInSurvey.join(
              ', ',
            )} are not in the survey ${surveyId}`,
      );
    }

    // TODO if survey has started, only admin can remove
    // ! => only admin can put to status REMOVED, not client

    const platformInfluencersThatHaveAcceptedSurvey =
      await this.prismaService.platformProductOrderInfluencer.findMany({
        where: {
          productOrderId: survey.platformProductOrderId,
          influencerId: { in: influencerIds },
          status: {
            in: [
              ProductOrderInfluencerStatus.Matching,
              ProductOrderInfluencerStatus.ToBeSubmitted,
              ProductOrderInfluencerStatus.ToBeApproved,
              ProductOrderInfluencerStatus.ToBeAnswered,
              ProductOrderInfluencerStatus.Approved,
              ProductOrderInfluencerStatus.ToBePaid,
              ProductOrderInfluencerStatus.Paid,
            ],
          },
        },
        include: {
          influencer: {
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
        },
      });

    // TODO refactor to return records, not the number of affected records
    const [influencersNotSelected, influencersRemoved] = await Promise.all([
      this.prismaService.platformProductOrderInfluencer.updateMany({
        data: { status: ProductOrderInfluencerStatus.NotSelected },
        where: {
          productOrderId: survey.platformProductOrderId,
          influencerId: { in: influencerIds },
          status: {
            in: [
              ProductOrderInfluencerStatus.Added,
              ProductOrderInfluencerStatus.Invited,
            ],
          },
        },
      }),
      this.prismaService.platformProductOrderInfluencer.updateMany({
        data: { status: ProductOrderInfluencerStatus.Removed },
        where: {
          productOrderId: survey.platformProductOrderId,
          influencerId: { in: influencerIds },
          status: {
            in: [
              // * if status is ADDED|INVITED, next status is NOT SELECTED
              ProductOrderInfluencerStatus.ToBeAnswered,
              ProductOrderInfluencerStatus.ToBeApproved,
              ProductOrderInfluencerStatus.Approved,
              ProductOrderInfluencerStatus.ToBePaid,
              ProductOrderInfluencerStatus.Paid,
            ],
          },
        },
      }),
    ]);

    for (let i = 0; i < surveyInfluencers.length; i++) {
      const chatRoom =
        await this.prismaService.platformProductOrderChatRoom.findFirst({
          where: {
            productOrderId: survey.platformProductOrderId,
            productOrderChatRoomMembers: {
              some: {
                userId: surveyInfluencers[i].influencer.userId,
              },
            },
          },
        });

      await this.prismaService.platformProductOrderChatRoom.delete({
        where: {
          id: chatRoom.id,
        },
      });
    }

    if (platformInfluencersThatHaveAcceptedSurvey.length) {
      platformInfluencersThatHaveAcceptedSurvey.forEach(
        async (platformInfluencer) => {
          const { id } = platformInfluencer.influencer.user;

          await this.notificationService.surveyInfluencerRemovedAfterApplication(
            id,
            survey.id,
          );
        },
      );
    }

    return {
      count: influencersNotSelected.count + influencersRemoved.count,
    } as Prisma.BatchPayload;
  }

  async removeInfluencerSelf(surveyId: number, user: UserWithInfluencer) {
    if (!user.influencer) {
      throw new BadRequestApplicationException(
        `User ${userIdentity(user)} is not an influencer`,
      );
    }

    const survey = await this.prismaService.survey.findUniqueOrThrow({
      where: { id: surveyId },
      select: {
        id: true,
        name: true,
        platformProductOrderId: true,
        platformProductOrder: {
          select: {
            id: true,
            clientId: true,
            platformProductOrderInfluencers: {
              where: { influencerId: user.influencer.id },
            },
          },
        },
      },
    });
    const surveyInfluencer =
      survey.platformProductOrder.platformProductOrderInfluencers[0];

    if (
      user.influencer.id !== surveyInfluencer.influencerId ||
      surveyInfluencer.status < ProductOrderInfluencerStatus.Invited
    ) {
      throw new ApplicationException(
        `Influencer ${userIdentity(
          user,
        )} is not in the survey ${surveyId} or is not invited yet`,
      );
    } else if (
      surveyInfluencer.status === ProductOrderInfluencerStatus.Invited
    ) {
      throw new ForbiddenApplicationException(
        `Can't remove itself from the survey if invitation is not accepted, eg. not in the survey`,
      );
    }

    const chatRoom =
      await this.prismaService.platformProductOrderChatRoom.findFirst({
        where: {
          productOrderId: survey.platformProductOrderId,
          productOrderChatRoomMembers: {
            some: {
              userId: user.id,
            },
          },
        },
      });

    await this.prismaService.platformProductOrderChatRoom.delete({
      where: {
        id: chatRoom.id,
      },
    });

    const withdrawnInfluencer =
      await this.prismaService.platformProductOrderInfluencer.update({
        data: { status: ProductOrderInfluencerStatus.Withdrawn },
        where: {
          id: surveyInfluencer.id,
        },
        include: {
          influencer: {
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
        },
      });

    if (withdrawnInfluencer.status === ProductOrderInfluencerStatus.Withdrawn) {
      const { firstName, lastName } = withdrawnInfluencer.influencer.user;
      await this.notificationService.surveyInfluencerWithdrawAfterApplication(
        withdrawnInfluencer.influencer.userId,
        survey.id,
        firstName,
        lastName,
        survey.name,
      );
    }
    return withdrawnInfluencer;
  }
  //#endregion

  //#region QUESTION CRUD
  async createQuestion(
    surveyId: number,
    createQuestionDto: CreateQuestionDto,
    user: UserEntity,
    includeAnswerChoices = false,
  ) {
    const {
      questionText,
      questionType,
      order,
      questionCredit,
      answers,
      isOptional,
    } = createQuestionDto;

    return await this.prismaService.$transaction(async (tx) => {
      const surveyQuestions = await tx.survey.findUnique({
        where: {
          id: surveyId,
        },
        select: {
          surveyType: true,
          questionCount: true,
          surveyQuestions: true,
          platformProductOrder: {
            select: {
              status: true,
            },
          },
        },
      });

      if (
        surveyQuestions.platformProductOrder.status !== Status.InPreparation
      ) {
        throw new ForbiddenException(
          'You cannot add more questions because the survey has started.',
        );
      }

      if (surveyQuestions.surveyType !== SurveyType.Questionnaire) {
        throw new BadRequestException(`This survey is not a questionnaire.`);
      }

      const surveyResponse = await tx.surveyQuestion.create({
        data: {
          surveyId,
          questionText: questionText || undefined,
          questionType,
          order,
          questionCredit:
            user.role === UserRole.SuperAdmin ? questionCredit : undefined,
          isOptional,
        },
        include: {
          surveyOptions: includeAnswerChoices,
        },
      });

      if (answers && answers.length > 0) {
        const surveyOptionsData = answers.map((answer) => {
          return {
            surveyQuestionId: surveyResponse.id,
            optionText: answer.answer,
            isOther: answer.isOther,
          };
        });

        await tx.surveyOption.createMany({
          data: surveyOptionsData,
        });
      }

      return surveyResponse;
    });
  }

  async getQuestions(
    surveyId: number,
    user: UserEntity,
    includeAnswerChoices = false,
  ) {
    const surveyInfo = await this.prismaService.survey.findUniqueOrThrow({
      where: {
        id: surveyId,
      },
      select: {
        id: true,
        platformProductOrderId: true,
        platformProductOrder: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    const questions = await this.prismaService.surveyQuestion.findMany({
      where: {
        surveyId,
      },
      orderBy: { id: 'asc' },
      include: {
        surveyResponses: {
          where:
            UserRole.Influencer === user.role
              ? {
                  userId: user.id,
                }
              : undefined,
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                influencer: {
                  include: {
                    platformProductOrderInfluencers: {
                      where: {
                        productOrder: {
                          surveys: {
                            some: {
                              id: surveyId,
                            },
                          },
                        },
                      },
                      select: {
                        id: true,
                        influencerId: true,
                        status: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        surveyOptions: includeAnswerChoices
          ? {
              orderBy: { id: 'asc' }, // Order answers by ID ascending
              select: {
                id: true,
                optionText: true,
                surveyQuestionId: true,
                isOther: true,
              },
            }
          : undefined,
      },
    });

    if (includeAnswerChoices) {
      questions.forEach((question) => {
        question.surveyOptions.sort((a, b) => {
          if (a.isOther && !b.isOther) {
            return 1;
          } else if (!a.isOther && b.isOther) {
            return -1;
          } else {
            return a.id - b.id;
          }
        });
      });
    }

    if (user.role === UserRole.Client || user.role === UserRole.Influencer) {
      questions.forEach((question) => {
        delete question.questionCredit;
      });
    }

    if (
      user.role === UserRole.Influencer &&
      surveyInfo.platformProductOrder.status !== Status.OnGoing
    ) {
      throw new ForbiddenException(
        'You cannot fill out a survey, its has not started.',
      );
    }

    const formattedQuestions = questions.map((question) => {
      const formattedQuestion: any = { ...question };
      if (user.role === UserRole.SuperAdmin || user.role === UserRole.Client) {
        const uniqueUsers: {
          id: number;
          fullName: string;
        }[] = [];
        const anonymizedUserData = {};
        formattedQuestion.surveyResponses.forEach((response) => {
          const userSurveyStatus: number =
            response.user.influencer.platformProductOrderInfluencers[0].status;
          const userInfluencerId = response.user.influencer.id;

          if (
            ![
              ProductOrderInfluencerStatus.NotApproved,
              ProductOrderInfluencerStatus.ToBeApproved,
              ProductOrderInfluencerStatus.ToBeAnswered,
            ].includes(userSurveyStatus) &&
            !uniqueUsers.some((userObj) => userObj.id === userInfluencerId)
          ) {
            // Check if this user has already been anonymized
            if (!anonymizedUserData[response.user.id]) {
              // Generate a unique anonymized user index
              const uniqueIndex = Object.keys(anonymizedUserData).length + 1;
              anonymizedUserData[
                response.user.id
              ] = `Participant ${uniqueIndex}`;
            }

            const anonymousUser = anonymizedUserData[response.user.id];
            const userSelect = {
              id: response.user.influencer.id,
              fullName:
                user.role === UserRole.Client
                  ? anonymousUser
                  : `${response.user.firstName} ${response.user.lastName}`,
            };
            uniqueUsers.push(userSelect);
          }
        });
        formattedQuestion.usersThatResponded = uniqueUsers;
      }
      return formattedQuestion;
    });
    return formattedQuestions;
  }

  async updateQuestion(
    surveyId: number,
    questionId: number,
    updateQuestionDto: UpdateQuestionDto,
    includeAnswerChoices = false,
  ) {
    const { questionText, questionType, order, questionCredit, isOptional } =
      updateQuestionDto;

    return await this.prismaService.$transaction(async (tx) => {
      if (
        questionType === QuestionType.ShortAnswer ||
        questionType === QuestionType.Essay
      ) {
        await tx.surveyOption.deleteMany({
          where: {
            surveyQuestionId: questionId,
          },
        });
      }

      const surveyQuestions = await tx.survey.findUnique({
        where: {
          id: surveyId,
        },
        select: {
          surveyType: true,
          questionCount: true,
          surveyQuestions: {
            include: {
              surveyOptions: true,
            },
          },
          platformProductOrder: {
            select: {
              status: true,
            },
          },
        },
      });

      if (
        surveyQuestions.platformProductOrder.status !== Status.InPreparation
      ) {
        throw new ForbiddenException(
          'You cannot update more questions because the survey has started.',
        );
      }

      const surveyQuestion = await tx.surveyQuestion.update({
        where: { id: questionId },
        data: {
          questionText,
          questionType,
          order,
          questionCredit,
          isOptional,
        },
        include: {
          surveyOptions: includeAnswerChoices,
        },
      });

      return surveyQuestion;
    });
  }

  async getQuestionResponsesForGraphs(
    id: number,
    authUser: UserEntity,
    questionId: number,
    filterCriteriaDto: FilterResponseCriteriaDto,
  ) {
    const { influencerId } = filterCriteriaDto;

    const survey = await this.prismaService.survey.findUnique({
      where: {
        id,
      },
      include: {
        platformProductOrder: {
          include: {
            platformProductOrderInfluencers: true,
          },
        },
      },
    });

    if (!survey) {
      throw new NotFoundApplicationException(
        'There are no surveys with provided id.',
      );
    }

    if (authUser.role === UserRole.Influencer) {
      throw new ForbiddenApplicationException(
        'You are not allowed to view this survey data.',
      );
    }

    if (
      authUser.role === UserRole.Client &&
      authUser.client.id !== survey.platformProductOrder.clientId
    ) {
      throw new ForbiddenApplicationException(
        'You can view only your surveys.',
      );
    }

    if (influencerId) {
      const influencerFound =
        survey.platformProductOrder.platformProductOrderInfluencers.find(
          (influencer) => influencerId === influencer.influencerId,
        );
      if (!influencerFound) {
        throw new ForbiddenApplicationException(
          'Influencer is not part of this survey',
        );
      }
    }
    let influencer: Influencer;
    if (influencerId) {
      influencer = await this.prismaService.influencer.findUnique({
        where: {
          id: influencerId,
        },
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      });
    }

    const surveyResponses = await this.prismaService.surveyResponse.findMany({
      where: {
        surveyId: id,
        surveyQuestionId: questionId,
        userId: influencer ? influencer.userId : undefined,
        surveyQuestion: {
          questionType: {
            in: [QuestionType.MultipleChoice, QuestionType.SingleChoice],
          },
        },
      },
      include: {
        survey: {
          select: {
            platformProductOrder: {
              select: {
                platformProductOrderInfluencers: {
                  where: {
                    status: {
                      in: [
                        ProductOrderInfluencerStatus.Approved,
                        ProductOrderInfluencerStatus.ToBePaid,
                        ProductOrderInfluencerStatus.Paid,
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        surveyOption: {
          select: {
            id: true,
            surveyQuestionId: true,
            optionText: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            influencer: {
              select: {
                id: true,
                ethnicityId: true,
                dateOfBirth: true,
                gender: true,
                platformProductOrderInfluencers: {
                  where: {
                    productOrderId: survey.platformProductOrderId,
                  },
                },
              },
            },
          },
        },
      },
    });

    const groupedData = {};
    const anonymizedUserData = {};

    surveyResponses.forEach((response) => {
      const { surveyOptionId, user, surveyOption } = response;

      const userForGraphs =
        user.influencer.platformProductOrderInfluencers.find(
          (influencer) =>
            user.influencer.id === influencer.influencerId &&
            [
              ProductOrderInfluencerStatus.Approved,
              ProductOrderInfluencerStatus.ToBePaid,
              ProductOrderInfluencerStatus.Paid,
            ].includes(influencer.status),
        );

      if (!userForGraphs) {
        return;
      }

      const categories = ['dateOfBirth', 'ethnicity', 'gender'];

      categories.forEach((category) => {
        if (!groupedData[category]) {
          groupedData[category] = [];
        }

        let categoryValue = user.influencer[category];

        if (category === 'ethnicity') {
          categoryValue = user.influencer.ethnicityId;
        }

        // Check if this user has already been anonymized
        if (!anonymizedUserData[user.id]) {
          // Generate a unique anonymized user index
          const uniqueIndex = Object.keys(anonymizedUserData).length + 1;
          anonymizedUserData[user.id] = `Participant ${uniqueIndex}`;
        }
        // if (!anonymizedUserData[user.id]) {
        //   // Generate a unique anonymized user index
        //   uniqueParticipantCount++;
        //   anonymizedUserData[user.id] = `Participant ${uniqueParticipantCount}`;
        // }

        const anonymousUser = anonymizedUserData[user.id];

        groupedData[category].push({
          x: surveyOptionId,
          y:
            category === 'dateOfBirth'
              ? this.calculateAge(user.influencer[category])
              : categoryValue,
          r: 10,
          userFullName:
            authUser.role === UserRole.Client
              ? anonymousUser
              : `${user.firstName} ${user.lastName}`,
          optionText: surveyOption.optionText,
        });
      });
    });

    return groupedData;
  }

  calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();

    // Check if the birthday has occurred this year
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }

  mapAgeToAgeGroup(age: number): string {
    if (age >= 0 && age <= 15) return '0-15';
    else if (age >= 16 && age <= 25) return '16-25';
    else if (age >= 26 && age <= 35) return '26-35';
    else if (age >= 36 && age <= 45) return '36-45';
    else if (age >= 46 && age <= 55) return '46-55';
    else if (age >= 56 && age <= 65) return '56-65';
    else if (age >= 66 && age <= 75) return '66-75';
    else return '75+';
  }

  async getSurveyDemographicGraphsData(id: number, user: UserEntity) {
    if (user.role === UserRole.Influencer) {
      throw new ForbiddenApplicationException(
        'Influencers are not authorized to access this endpoint',
      );
    }
    const survey = await this.prismaService.survey.findUnique({
      where: {
        id,
      },
      include: {
        platformProductOrder: {
          select: {
            id: true,
            client: true,
            status: true,
            platformProductOrderInfluencers: {
              include: {
                influencer: {
                  include: {
                    stakeholders: true,
                    ethnicity: true,
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        location: {
                          select: {
                            country: true,
                          },
                        },
                      },
                    },
                    influencerDiseaseAreas: {
                      include: {
                        diseaseArea: true,
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

    if (survey.platformProductOrder.status === Status.InPreparation) {
      throw new ForbiddenApplicationException(
        'Survey is still in preparation mode',
      );
    }

    const today = new Date();
    const influencersData =
      survey.platformProductOrder.platformProductOrderInfluencers;

    const userForGraphs = influencersData.filter((influencer) =>
      [
        ProductOrderInfluencerStatus.Approved,
        ProductOrderInfluencerStatus.ToBePaid,
        ProductOrderInfluencerStatus.Paid,
      ].includes(influencer.status),
    );

    const influencersWithAge = userForGraphs.map((influencer) => {
      const birthdate = new Date(influencer.influencer.dateOfBirth);
      const age = today.getFullYear() - birthdate.getFullYear();
      return { ...influencer, age };
    });

    const ageGroups: string[] = [
      '0-15',
      '16-25',
      '26-35',
      '36-45',
      '46-55',
      '56-65',
      '66-75',
      '75+',
    ];

    const maleCounts: number[] = Array(ageGroups.length).fill(0);
    const femaleCounts: number[] = Array(ageGroups.length).fill(0);
    const otherCounts: number[] = Array(ageGroups.length).fill(0);

    influencersWithAge.forEach((influencer) => {
      const ageGroup = this.mapAgeToAgeGroup(influencer.age);
      const gender = influencer.influencer.gender;

      const ageGroupIndex = ageGroups.indexOf(ageGroup);

      if (gender === 0) {
        maleCounts[ageGroupIndex]++;
      } else if (gender === 1) {
        femaleCounts[ageGroupIndex]++;
      } else if (gender === 2) {
        otherCounts[ageGroupIndex]++;
      }
    });

    const maleCountsStr = maleCounts.map(Number);
    const femaleCountsStr = femaleCounts.map(Number);
    const otherCountsStr = otherCounts.map(Number);

    const uniqueCountries = Array.from(
      new Set(
        userForGraphs.map(
          (influencer) => influencer.influencer.user.location.country.name,
        ),
      ),
    );

    const influencerCountriesCounts = uniqueCountries.map((country) => {
      const count = userForGraphs.filter(
        (influencer) =>
          influencer.influencer.user.location.country.name === country,
      ).length;
      return count;
    });

    // Country setup end

    // Stakeholder setup

    const influencerStakeholderCounts = Object.values(InfluencerType)
      .filter((type) => typeof type === 'number' && type >= 0) // Filter out values less than 0
      .map((type) => {
        const count = userForGraphs.filter(
          (platformInfluencer) => platformInfluencer.influencer.type === type,
        ).length;
        return count;
      });

    const influencerTypeLabels =
      this.getEnumValuesWithoutNumericKeys(InfluencerType);

    // stakeholder end

    const uniqueEthnicities = [
      ...new Set(
        userForGraphs.map((influencer) => influencer.influencer.ethnicity.name),
      ),
    ];
    const ethnicityCounts: number[] = Array(uniqueEthnicities.length).fill(0);

    userForGraphs.forEach((influencer) => {
      const ethnicityIndex = uniqueEthnicities.indexOf(
        influencer.influencer.ethnicity.name,
      );
      if (ethnicityIndex !== -1) {
        ethnicityCounts[ethnicityIndex]++;
      }
    });

    const filteredEthnicities = uniqueEthnicities.filter(
      (ethnicity, index) => ethnicityCounts[index] > 0,
    );
    const filteredCounts = ethnicityCounts.filter((count, index) => count > 0);

    // Disease Areas

    const uniqueDiseaseAreas: string[] = [];
    const diseaseAreaCounts: number[] = [];

    userForGraphs.forEach((platformInfluencer) => {
      platformInfluencer.influencer.influencerDiseaseAreas.forEach(
        (diseaseArea) => {
          const diseaseAreaName = diseaseArea.diseaseArea.name;
          const index = uniqueDiseaseAreas.indexOf(diseaseAreaName);

          if (index === -1) {
            uniqueDiseaseAreas.push(diseaseAreaName);
            diseaseAreaCounts.push(1); // Initialize count to 1
          } else {
            diseaseAreaCounts[index]++;
          }
        },
      );
    });

    const demographicsResult = {
      ageAndGenderGraph: {
        graphLabels: ageGroups,
        maleCountData: maleCountsStr,
        femaleCountData: femaleCountsStr,
        otherCountData: otherCountsStr,
      },
      countriesGraph: {
        graphLabels: uniqueCountries,
        influencerCountryData: influencerCountriesCounts,
      },
      stakeholderGraph: {
        graphLabels: influencerTypeLabels,
        influencerStakeholderData: influencerStakeholderCounts,
      },
      ethnicitiesGraph: {
        graphLabels: filteredEthnicities,
        influencerEthnicityData: filteredCounts,
      },
      diseasesGraph: {
        graphLabels: uniqueDiseaseAreas,
        influencerDiseaseData: diseaseAreaCounts,
      },
    };

    return demographicsResult;
  }

  getEnumValuesWithoutNumericKeys(enumObj: any): string[] {
    return Object.values(enumObj)
      .filter((value) => typeof value === 'string')
      .map((value) => value as string);
  }

  async deleteQuestion(questionId: number) {
    return await this.prismaService.surveyQuestion.delete({
      where: { id: questionId },
    });
  }
  //#endregion

  //#region QUESTION ANSWER/S CRUD
  async createAnswerChoice(
    questionId: number,
    createAnswerChoice: CreateAnswerChoiceDto,
  ) {
    const { answer, order, isOther } = createAnswerChoice;

    return await this.prismaService.$transaction(async (tx) => {
      // Fetch survey questions
      const questions = await tx.surveyOption.findMany({
        where: {
          surveyQuestionId: questionId,
        },
      });

      const surveyQuestion = await tx.surveyQuestion.findUnique({
        where: {
          id: questionId,
        },
        select: {
          survey: {
            select: {
              id: true,
              platformProductOrder: {
                select: {
                  id: true,
                  status: true,
                },
              },
            },
          },
        },
      });

      if (
        surveyQuestion.survey.platformProductOrder.status !==
        Status.InPreparation
      ) {
        throw new ForbiddenApplicationException(
          'You cannot do this because survey is no longer in preparation.',
        );
      }

      if (isOther && questions.find((question) => question.isOther)) {
        throw new ApplicationException(`You can only have one other question`);
      }
      // check if any question contains a previous isOther flag
      // If it contains it forbid it from submitting else create the question

      return await this.prismaService.surveyOption.create({
        data: {
          surveyQuestionId: questionId,
          optionText: answer || undefined,
          order,
          isOther,
        },
      });
    });
  }

  async getAnswerChoices(questionId: number) {
    return await this.prismaService.surveyOption.findMany({
      where: { surveyQuestionId: questionId },
    });
  }

  async updateAnswerChoice(
    choiceId: number,
    updateAnswerChoice: UpdateAnswerChoiceDto,
  ) {
    const { answer, order } = updateAnswerChoice;

    const surveyChoice = await this.prismaService.surveyOption.findUnique({
      where: {
        id: choiceId,
      },
      select: {
        surveyQuestion: {
          select: {
            survey: {
              select: {
                platformProductOrder: {
                  select: {
                    id: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (
      surveyChoice.surveyQuestion.survey.platformProductOrder.status !==
      Status.InPreparation
    ) {
      throw new ForbiddenApplicationException(
        'You cannot do this because survey is no longer in preparation.',
      );
    }

    return await this.prismaService.surveyOption.update({
      where: { id: choiceId },
      data: {
        optionText: answer,
        order,
      },
    });
  }

  async deleteAnswerChoice(choiceId: number) {
    const surveyChoice = await this.prismaService.surveyOption.findUnique({
      where: {
        id: choiceId,
      },
      select: {
        surveyQuestion: {
          select: {
            survey: {
              select: {
                platformProductOrder: {
                  select: {
                    id: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (
      surveyChoice.surveyQuestion.survey.platformProductOrder.status !==
      Status.InPreparation
    ) {
      throw new ForbiddenApplicationException(
        'You cannot do this because survey is no longer in preparation.',
      );
    }

    return await this.prismaService.surveyOption.delete({
      where: { id: choiceId },
    });
  }
  //#endregion

  async submitSurveyResult(
    surveyId: number,
    user: UserWithInfluencer,
    data: SubmitSurveyResultDto[],
  ) {
    if (!user.influencer) {
      throw new BadRequestApplicationException(
        `User ${userIdentity(user)} is not an influencer`,
      );
    }

    const survey = await this.prismaService.survey.findUniqueOrThrow({
      where: { id: surveyId },
      include: {
        platformProductOrder: {
          select: {
            id: true,
            status: true,
            platformProductOrderInfluencers: {
              where: { influencerId: user.influencer.id },
              include: {
                influencer: {
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
              },
            },
          },
        },
      },
    });
    const surveyInfluencer =
      survey.platformProductOrder.platformProductOrderInfluencers[0];

    if (survey.platformProductOrder.status === Status.Finished) {
      throw new ForbiddenApplicationException(
        'You are not allowed to submit questions because the survey has finished.',
      );
    }

    if (
      ![
        ProductOrderInfluencerStatus.ToBeAnswered,
        ProductOrderInfluencerStatus.NotApproved,
      ].includes(surveyInfluencer.status) ||
      ([
        ProductOrderInfluencerStatus.ToBeAnswered,
        ProductOrderInfluencerStatus.NotApproved,
      ].includes(surveyInfluencer.status) &&
        survey.platformProductOrder.status === Status.InPreparation)
    ) {
      throw new ForbiddenApplicationException(
        `Influencer ${userIdentity(
          user,
        )} doesn't have a match (or is already approved) - confirm a result first`,
      );
    }

    return await this.prismaService.$transaction(async (tx) => {
      await tx.platformProductOrderInfluencer.update({
        data: {
          status: ProductOrderInfluencerStatus.ToBeApproved,
        },
        where: {
          id: surveyInfluencer.id,
        },
      });

      if (
        surveyInfluencer.status === ProductOrderInfluencerStatus.NotApproved
      ) {
        await tx.surveyResponse.deleteMany({
          where: {
            userId: user.id,
            surveyId,
          },
        });
      }

      const responses = [];
      for (const surveyResponse of data) {
        if (
          (surveyResponse.surveyResponseText === undefined ||
            surveyResponse.surveyResponseText === '') &&
          surveyResponse.surveyOptionId === undefined
        ) {
          continue;
        }
        const response = await tx.surveyResponse.create({
          data: {
            userId: user.id,
            surveyId,
            surveyQuestionId: surveyResponse.surveyQuestionId,
            surveyOptionId: surveyResponse.surveyOptionId,
            surveyResponseText: surveyResponse.surveyResponseText,
          },
        });
        responses.push(response);
      }

      await this.notificationService.surveyInfluencerAnswersSubmited(
        surveyInfluencer.influencer.user.id,
        survey.id,
        survey.name,
        surveyInfluencer.influencer.user.firstName,
        surveyInfluencer.influencer.user.lastName,
      );
    });
  }

  // * accept
  async approveSurveyResult(
    surveyId: number,
    influencerIds: number[],
    user: UserEntity,
  ) {
    const survey = await this.prismaService.survey.findUniqueOrThrow({
      where: { id: surveyId },
      include: {
        platformProductOrder: {
          select: {
            id: true,
            client: {
              select: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            platformProductOrderInfluencers: {
              where: { influencer: { id: { in: influencerIds } } },
              select: {
                id: true,
                status: true,
                influencer: {
                  select: {
                    id: true,
                    userId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const surveyInfluencers =
      survey.platformProductOrder.platformProductOrderInfluencers;
    const userInfluencersNotInSurvey = influencerIds.filter(
      (influencerId) =>
        !surveyInfluencers.find(
          (surveyInfluencer) => surveyInfluencer.influencer.id === influencerId,
        ),
    );
    const surveyInfluencersWithInvalidStatus = surveyInfluencers.filter(
      (surveyInfluencer) =>
        ![
          ProductOrderInfluencerStatus.ToBeApproved,
          ProductOrderInfluencerStatus.NotApproved,
        ].includes(surveyInfluencer.status),
    );

    if (userInfluencersNotInSurvey.length) {
      throw new BadRequestApplicationException(
        userInfluencersNotInSurvey.length === 1
          ? `Influencer ${userInfluencersNotInSurvey[0]} is not in the survey ${surveyId}`
          : `Influencers ${userInfluencersNotInSurvey.join(
              ', ',
            )} are not in the survey ${surveyId}`,
      );
    } else if (surveyInfluencersWithInvalidStatus.length) {
      throw new BadRequestApplicationException(
        surveyInfluencersWithInvalidStatus.length === 1
          ? `Influencer ${surveyInfluencersWithInvalidStatus[0]} doesn't have valid state to become approved - force him to submit the survey`
          : `Influencers ${surveyInfluencersWithInvalidStatus.join(
              ', ',
            )} don't have valid state to become approved - force them to submit the survey`,
      );
    }

    const isAdmin = user.role === UserRole.SuperAdmin;

    return await this.prismaService.$transaction(async (tx) => {
      const updatedInfluencers =
        await tx.platformProductOrderInfluencer.updateMany({
          data: {
            status: ProductOrderInfluencerStatus.Approved,
          },
          where: {
            productOrderId: survey.platformProductOrderId,
            influencerId: {
              in: influencerIds,
            },
          },
        });

      const platformInfluencers =
        await tx.platformProductOrderInfluencer.findMany({
          where: {
            productOrderId: survey.platformProductOrderId,
            influencerId: {
              in: influencerIds,
            },
          },
          include: {
            influencer: {
              include: {
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
        });

      platformInfluencers.forEach(async (platformInfluencer) => {
        await this.notificationService.surveySubmissionApprovedOrDeclined(
          platformInfluencer.influencer.user.id,
          survey.id,
          survey.name,
          `${platformInfluencer.influencer.user.firstName} ${platformInfluencer.influencer.user.lastName}`,
          `${survey.platformProductOrder.client.user.firstName} ${survey.platformProductOrder.client.user.lastName}`,
          isAdmin,
        );

        const content = `We're excited to inform you that your submission for the survey "${survey.name}" has been reviewed. We appreciate your effort and dedication. Please log in to your account to see the feedback.`;

        await this.mailService.sendNotificationToInfluencer(
          platformInfluencer.influencer.user.email,
          platformInfluencer.influencer.user.firstName,
          content,
        );
      });

      return updatedInfluencers;
    });
  }

  async disapproveSurveyResult(
    surveyId: number,
    influencerIds: number[],
    user: UserEntity,
  ) {
    const survey = await this.prismaService.survey.findUniqueOrThrow({
      where: { id: surveyId },
      include: {
        platformProductOrder: {
          select: {
            id: true,
            client: {
              select: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            platformProductOrderInfluencers: {
              where: { influencer: { id: { in: influencerIds } } },
              select: {
                id: true,
                status: true,
                influencer: {
                  select: {
                    id: true,
                    userId: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const surveyInfluencers =
      survey.platformProductOrder.platformProductOrderInfluencers;
    const userInfluencersNotInSurvey = influencerIds.filter(
      (influencerId) =>
        !surveyInfluencers.find(
          (surveyInfluencer) => surveyInfluencer.influencer.id === influencerId,
        ),
    );
    const surveyInfluencersWithInvalidStatus = surveyInfluencers.filter(
      (surveyInfluencer) =>
        surveyInfluencer.status !== ProductOrderInfluencerStatus.ToBeApproved,
    );

    if (userInfluencersNotInSurvey.length) {
      throw new BadRequestApplicationException(
        userInfluencersNotInSurvey.length === 1
          ? `Influencer ${userInfluencersNotInSurvey[0]} is not in the survey ${surveyId}`
          : `Influencers ${userInfluencersNotInSurvey.join(
              ', ',
            )} are not in the survey ${surveyId}`,
      );
    } else if (surveyInfluencersWithInvalidStatus.length) {
      throw new BadRequestApplicationException(
        surveyInfluencersWithInvalidStatus.length === 1
          ? `Influencer ${surveyInfluencersWithInvalidStatus[0]} doesn't have valid state to become approved - force him to submit the survey`
          : `Influencers ${surveyInfluencersWithInvalidStatus.join(
              ', ',
            )} don't have valid state to become approved - force them to submit the survey`,
      );
    }

    const isAdmin = user.role === UserRole.SuperAdmin;

    return await this.prismaService.$transaction(async (tx) => {
      const updatedInfluencers =
        await tx.platformProductOrderInfluencer.updateMany({
          data: {
            status: ProductOrderInfluencerStatus.NotApproved,
          },
          where: {
            productOrderId: survey.platformProductOrderId,
            influencerId: {
              in: influencerIds,
            },
          },
        });

      const platformInfluencers =
        await tx.platformProductOrderInfluencer.findMany({
          where: {
            productOrderId: survey.platformProductOrderId,
            influencerId: {
              in: influencerIds,
            },
          },
          include: {
            influencer: {
              include: {
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
        });

      platformInfluencers.forEach(async (platformInfluencer) => {
        await this.notificationService.surveySubmissionApprovedOrDeclined(
          platformInfluencer.influencer.user.id,
          survey.id,
          survey.name,
          `${platformInfluencer.influencer.user.firstName} ${platformInfluencer.influencer.user.lastName}`,
          `${survey.platformProductOrder.client.user.firstName} ${survey.platformProductOrder.client.user.lastName}`,
          isAdmin,
        );

        const content = `We're excited to inform you that your submission for the survey "${survey.name}" has been reviewed. We appreciate your effort and dedication. Please log in to your account to see the feedback.`;

        await this.mailService.sendNotificationToInfluencer(
          platformInfluencer.influencer.user.email,
          platformInfluencer.influencer.user.firstName,
          content,
        );
      });

      return updatedInfluencers;
    });
  }

  async startSurvey(surveyId: number) {
    const survey = await this.prismaService.survey.findUniqueOrThrow({
      where: { id: surveyId },
      include: {
        surveyQuestions: {
          select: {
            questionType: true,
            questionText: true,
            questionCredit: true,
            surveyOptions: true,
          },
        },
        platformProductOrder: {
          include: {
            platformProductOrderInfluencers: true,
          },
        },
      },
    });

    if (
      survey.surveyQuestions.find(
        (surveyQuestion) => !surveyQuestion.questionCredit,
      )
    ) {
      throw new BadRequestApplicationException(
        `Please enter question credits on all questions`,
      );
    }

    if (
      survey.surveyQuestions.find(
        (surveyQuestion) => !surveyQuestion.questionText,
      )
    ) {
      throw new BadRequestApplicationException(
        `Please enter question text on all questions.`,
      );
    }

    const surveyQuestionTypes = survey.surveyQuestions.length
      ? survey.surveyQuestions.map((question) => question.questionType)
      : [];

    const surveyQuestionWithChoices = survey.surveyQuestions.length
      ? survey.surveyQuestions.filter((question) =>
          [QuestionType.SingleChoice, QuestionType.MultipleChoice].includes(
            question.questionType,
          ),
        )
      : [];

    if (
      surveyQuestionTypes.some((questionType) =>
        [QuestionType.SingleChoice, QuestionType.MultipleChoice].includes(
          questionType,
        ),
      ) &&
      !!surveyQuestionWithChoices.find(
        (surveyQuestion) =>
          surveyQuestion.surveyOptions &&
          (!surveyQuestion.surveyOptions.length ||
            (surveyQuestion.surveyOptions.length &&
              !surveyQuestion.surveyOptions.find(
                (option) => !!option.optionText,
              ))),
      )
    ) {
      throw new BadRequestApplicationException(
        `Please enter survey option text on all option fields.`,
      );
    }
    const surveyInfluencers =
      survey.platformProductOrder.platformProductOrderInfluencers;

    if (survey.platformProductOrder.status === Status.OnGoing) {
      throw new BadRequestApplicationException(
        `Survey ${surveyId} has already started`,
      );
    } else if (survey.platformProductOrder.status > Status.OnGoing) {
      throw new BadRequestApplicationException(
        `Survey ${surveyId} has finished`,
      );
    } else if (!survey.instructionsDescription) {
      throw new BadRequestApplicationException(
        `Fill the data required: instructions`,
      );
    }

    const startedSurvey = await this.prismaService.survey.update({
      data: {
        platformProductOrder: {
          update: {
            status: Status.OnGoing,
          },
        },
      },
      where: {
        id: surveyId,
      },
      include: {
        platformProductOrder: {
          include: {
            client: {
              select: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
                ambassador: {
                  select: {
                    user: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
            platformProductOrderInfluencers: {
              where: {
                status: {
                  in: [
                    ProductOrderInfluencerStatus.Approved,
                    ProductOrderInfluencerStatus.NotApproved,
                    ProductOrderInfluencerStatus.Declined,
                    ProductOrderInfluencerStatus.Matching,
                    ProductOrderInfluencerStatus.ToBePaid,
                    ProductOrderInfluencerStatus.Paid,
                    ProductOrderInfluencerStatus.ToBeAnswered,
                    ProductOrderInfluencerStatus.ToBeAnswered,
                    ProductOrderInfluencerStatus.ToBeSubmitted,
                    ProductOrderInfluencerStatus.ToBeApproved,
                  ],
                },
              },
              select: {
                influencer: {
                  select: {
                    userId: true,
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
          },
        },
      },
    });

    if (startedSurvey.platformProductOrder) {
      const platformInfluencersToNotify =
        startedSurvey.platformProductOrder.platformProductOrderInfluencers;
      const platformProductInfluencersIds = platformInfluencersToNotify.map(
        (influencer) => influencer.influencer.userId,
      );

      const {
        id: clientUserId,
        firstName: clientFirstName,
        lastName: clientLastName,
      } = startedSurvey.platformProductOrder.client.user;

      const { id: ambassadorUserId } =
        startedSurvey.platformProductOrder.client.ambassador.user;

      await this.notificationService.SurveyStarted(
        platformProductInfluencersIds,
        clientUserId,
        clientFirstName,
        clientLastName,
        startedSurvey.id,
        startedSurvey.name,
        ambassadorUserId || undefined,
      );

      platformInfluencersToNotify.forEach(async (platformInfluencer) => {
        const content = `The survey you're part of has officially started. This is your moment to shine and make a real impact. Log in to your account for more details and get ready to inspire your audience.`;

        await this.mailService.sendNotificationToInfluencer(
          platformInfluencer.influencer.user.email,
          platformInfluencer.influencer.user.firstName,
          content,
        );
      });
    }

    return startedSurvey;
  }

  async finishSurvey(surveyId: number) {
    const survey = await this.prismaService.survey.findUniqueOrThrow({
      where: { id: surveyId },
      include: {
        platformProductOrder: {
          include: {
            platformProductOrderInfluencers: {
              select: {
                influencer: {
                  select: {
                    userId: true,
                  },
                },
              },
            },
            client: {
              select: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
                ambassador: {
                  select: {
                    user: {
                      select: {
                        id: true,
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

    if (survey.platformProductOrder.status !== Status.OnGoing) {
      throw new ForbiddenApplicationException(
        `Survey can't be stopped as it is not started`,
      );
    } else if (survey.platformProductOrder.status > Status.Finished) {
      throw new ForbiddenApplicationException(
        `Survey can't be stopped as it is already finished`,
      );
    }

    return await this.prismaService.$transaction(async (tx) => {
      await tx.platformProductOrderInfluencer.updateMany({
        data: {
          status: ProductOrderInfluencerStatus.ToBePaid,
        },
        where: {
          productOrderId: survey.platformProductOrderId,
          status: ProductOrderInfluencerStatus.Approved,
        },
      });

      const updatedSurvey = await this.prismaService.survey.update({
        data: {
          platformProductOrder: {
            update: {
              status: Status.Finished,
            },
          },
        },
        where: {
          id: surveyId,
        },
        include: {
          platformProductOrder: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      if (updatedSurvey.platformProductOrder.status === Status.Finished) {
        const influencerUserIds =
          survey.platformProductOrder.platformProductOrderInfluencers.map(
            (influencer) => influencer.influencer.userId,
          );
        await this.notificationService.SurveyEnded(
          influencerUserIds,
          survey.platformProductOrder.client.user.id,
          survey.platformProductOrder.client.ambassador.user.id,
          survey.id,
          survey.name,
          `${survey.platformProductOrder.client.user.firstName} ${survey.platformProductOrder.client.user.lastName}`,
        );
      }

      return updatedSurvey;
    });
  }

  async archiveSurvey(surveyId: number) {
    const survey = await this.prismaService.survey.findUniqueOrThrow({
      where: { id: surveyId },
      include: { platformProductOrder: true },
    });

    if (survey.platformProductOrder.status <= Status.OnGoing) {
      throw new ForbiddenApplicationException(
        `Survey can't be archived as it is not finished`,
      );
    } else if (survey.platformProductOrder.status === Status.Archived) {
      throw new ForbiddenApplicationException(`Survey is already archived`);
    }

    return await this.prismaService.survey.update({
      data: {
        platformProductOrder: {
          update: {
            status: Status.Archived,
          },
        },
      },
      where: {
        id: surveyId,
      },
    });
  }

  private handleStatus = (status: Status) => {
    switch (status) {
      case Status.InPreparation:
        return 'In preparation';
      case Status.OnGoing:
        return 'On going';
      case Status.Finished:
        return 'Finished';
      case Status.Archived:
        return 'Archived';
      case Status.Ordered:
        return 'Ordered';
      case Status.Ready:
        return 'Ready';
      case Status.Delivered:
        return 'Delivered';
      default:
        return '';
    }
  };

  private handleCurrency(currency: Currency) {
    switch (currency) {
      case Currency.euro:
        return 'EUR';
      case Currency.usd:
        return 'USD';
      case Currency.chf:
        return 'CHF';
      default:
        return '';
    }
  }

  async exportSurveys(dto: FindByIdsDto, user: User) {
    let queryWhere: Prisma.SurveyWhereInput = {
      id: {
        in: dto.ids,
      },
      platformProductOrder: {
        status: dto.status,
      },
    };

    if (user.role === UserRole.Client) {
      queryWhere = {
        ...queryWhere,
        platformProductOrder: {
          client: {
            userId: user.id,
          },
        },
      };
    }

    const surveys = await this.prismaService.survey.findMany({
      where: queryWhere,
      include: {
        stakeholderTypes: true,
        products: {
          include: {
            product: true,
          },
        },
        platformProductOrder: {
          include: {
            client: {
              include: {
                user: true,
              },
            },
            currency: true,
            platformProductOrderDiseaseAreas: {
              include: {
                diseaseArea: true,
              },
            },
            platformProductOrderEthnicities: {
              include: {
                ethnicity: true,
              },
            },
            platformProductOrderGenders: true,
            platformProductOrderInfluencers: {
              include: {
                influencer: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            platformProductOrderInterests: {
              include: {
                interest: true,
              },
            },
            platformProductOrderLanguages: true,
            platformProductOrderLocations: {
              include: {
                location: true,
              },
            },
            platformProductOrderStruggles: {
              include: {
                struggle: true,
              },
            },
            platformProductOrderSymptoms: {
              include: {
                symptom: true,
              },
            },
          },
        },
      },
    });

    const handleProducts = (products) => {
      return products && products.length > 0
        ? products?.map((product) => product.product.name).join(' | ')
        : '';
    };

    return surveys?.map((item) => {
      return {
        name: item.name,
        dateStart: item.dateStart,
        dateEnd: item.dateEnd,
        status: this.handleStatus(item.platformProductOrder.status),
        surveyDescription: item.surveyDescription,
        participantCount: item.participantCount,
        questionCount: item.questionCount,
        ageMax: item.ageMax,
        ageMin: item.ageMin,
        participantDescription: item.participantsDescription,
        surveyType: item.surveyType,
        fileUploadUrl: item.fileUploadUrl,
        questionCredits: item.questionCredits,
        link: item.link,
        contract: item.contract,
        isContractApproved: item.isContractApproved,
        products: handleProducts(item.products),
        budget: item.platformProductOrder.budget
          ? `${this.handleCurrency(
              item.platformProductOrder.currencyId,
            )} ${item.platformProductOrder.budget?.toNumber()}`
          : '',
        clientFullName: `${item.platformProductOrder.client.user.firstName} ${item.platformProductOrder.client.user.lastName}`,
        clientEmail: item.platformProductOrder.client.user.email,
        diseaseAreas:
          item.platformProductOrder.platformProductOrderDiseaseAreas.length > 0
            ? item.platformProductOrder.platformProductOrderDiseaseAreas
                .map((item) => item.diseaseArea.name)
                .join(' | ')
            : '',
        location:
          item.platformProductOrder.platformProductOrderLocations.length > 0
            ? item.platformProductOrder.platformProductOrderLocations
                .map((item) => item.location.name)
                .join(' | ')
            : '',
        interests:
          item.platformProductOrder.platformProductOrderInterests.length > 0
            ? item.platformProductOrder.platformProductOrderInterests
                .map((item) => item.interest.name)
                .join(' | ')
            : '',
        ethnicities:
          item.platformProductOrder.platformProductOrderEthnicities.length > 0
            ? item.platformProductOrder.platformProductOrderEthnicities
                .map((item) => item.ethnicity.name)
                .join(' | ')
            : '',
        struggles:
          item.platformProductOrder.platformProductOrderStruggles.length > 0
            ? item.platformProductOrder.platformProductOrderStruggles
                .map((item) => item.struggle.name)
                .join(' | ')
            : '',
        symptoms:
          item.platformProductOrder.platformProductOrderSymptoms.length > 0
            ? item.platformProductOrder.platformProductOrderSymptoms
                .map((item) => item.symptom.name)
                .join(' | ')
            : '',
      };
    });
  }
}
