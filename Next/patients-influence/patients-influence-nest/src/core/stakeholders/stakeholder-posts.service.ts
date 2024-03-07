import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { StakeholderType } from '../../utils/enums/stakeholder-type.enum';
import { SmlWithType } from '../sml/types/sml-with.type';
import { SmlPostsFilterDto } from '../sml/dto';
import { ThemeName } from 'src/utils/enums/theme-names.enum';
import { calculateDOB } from 'src/utils';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { Prisma } from '@prisma/client';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';

@Injectable()
export class StakeholderPostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findPostsForSML(
    filters: SmlPostsFilterDto,
    sml: SmlWithType,
    { skip, take, sortBy, search }: FilterParamsDto,
  ) {
    const { authorFilter, postFilter } = filters;
    const { minDOB, maxDOB } = calculateDOB(
      filters.authorFilter?.ageMin,
      filters.authorFilter?.ageMax,
    );
    const queryWhere: Prisma.StakeholderPostWhereInput = {
      AND: [
        {
          //* Get all posts that fulfill SmlPostsFilter
          stakeholder: {
            //* Filter by stakeholders
            id: { in: authorFilter?.stakeholders },
            OR: [
              {
                type: {
                  in: [StakeholderType.Patient, StakeholderType.Caregiver],
                },
                patientCaregiverDiseaseAreas: authorFilter?.diseaseAreas && {
                  some: {
                    diseaseAreaId: {
                      in: authorFilter?.diseaseAreas,
                    },
                  },
                },
                stakeholderPosts: authorFilter?.symptoms &&
                  authorFilter?.struggles && {
                    some: {
                      postStruggles: authorFilter?.struggles && {
                        some: {
                          struggleId: { in: authorFilter?.struggles },
                        },
                      },
                      postSymptom: authorFilter?.symptoms && {
                        some: {
                          symptomId: { in: authorFilter?.symptoms },
                        },
                      },
                    },
                  },
              },
              {
                type: {
                  in: [StakeholderType.Doctor, StakeholderType.Nurse],
                },
                stakeholderPosts: (authorFilter?.struggles ||
                  postFilter?.symptoms) && {
                  some: {
                    postStruggles: authorFilter?.struggles && {
                      some: {
                        struggleId: { in: authorFilter?.struggles },
                      },
                    },
                    postSymptom: postFilter?.symptoms && {
                      some: { symptomId: { in: postFilter.symptoms } },
                    },
                  },
                },
              },
            ],
            stakeholderPosts: authorFilter?.interests && {
              some: {
                postInterests: {
                  some: {
                    interestId: { in: authorFilter?.interests },
                  },
                },
              },
            },
            gender: authorFilter?.genders && { in: authorFilter?.genders },
            locationId: authorFilter?.locations && {
              in: authorFilter?.locations,
            },
            ethnicityId: authorFilter?.ethnicities && {
              in: authorFilter?.ethnicities,
            },
            // stakeholderInterests: authorFilter?.interests && { //! deprecated
            //   some: {
            //     interestId: {
            //       in: authorFilter?.interests,
            //     },
            //   },
            // },
            socialPlatformId: postFilter?.socialMedias && {
              in: postFilter.socialMedias,
            },
          },
          //* Filter by posts
          OR: [
            {
              stakeholder: {
                type: {
                  in: [StakeholderType.Patient, StakeholderType.Caregiver],
                },
              },
              AND: [
                {
                  postThemes: {
                    some: {
                      theme: {
                        name: {
                          in: [
                            ThemeName.Personal,
                            ThemeName.HealthyLifestyle,
                            ThemeName.Medical,
                          ],
                        },
                      },
                    },
                  },
                },
                {
                  postThemes: postFilter?.themes && {
                    some: {
                      themeId: {
                        in: postFilter.themes,
                      },
                    },
                  },
                },
              ],
            },
            {
              AND: [
                {
                  postThemes: {
                    some: {
                      theme: {
                        name: {
                          in: [
                            ThemeName.Personal,
                            ThemeName.PersonalHealth,
                            ThemeName.Professional,
                          ],
                        },
                      },
                    },
                  },
                },
                {
                  postThemes: postFilter?.themes && {
                    some: { themeId: { in: postFilter.themes } },
                  },
                },
              ],
            },
          ], //Patient + caregiver or Doctor+nurse
          postDiseaseAreas: postFilter?.diseaseAreas && {
            some: { diseaseAreaId: { in: postFilter.diseaseAreas } },
          },
          postStruggles: postFilter?.struggles && {
            some: { struggleId: { in: postFilter.struggles } },
          },
          postSymptom: postFilter?.symptoms && {
            some: { symptomId: { in: postFilter.symptoms } },
          },
          postInterests: postFilter?.interests && {
            some: { interestId: { in: postFilter.interests } },
          },
          overallSentiment: postFilter?.sentiments && {
            in: postFilter.sentiments,
          },
          language: postFilter?.languages && { in: postFilter.languages },
          postBrands: postFilter?.brands && {
            some: { brandId: { in: postFilter.brands } },
          },
          postProducts: postFilter?.products && {
            some: { productId: { in: postFilter.products } },
          },
          likes: { gte: postFilter?.likesMin, lte: postFilter?.likesMax },
          comments: {
            gte: postFilter?.commentsMin,
            lte: postFilter?.commentsMax,
          },
          content: {
            contains: postFilter?.keyword,
          },
        },
        {
          //* Get all posts from DiseaseArea and Platform of SML (filter by SML)
          OR: [
            {
              //* Get all Patient and Caregiver posts that have PatientCaregiverDiseaseArea in SML
              stakeholder: {
                type: {
                  in: [StakeholderType.Patient, StakeholderType.Caregiver],
                },
                patientCaregiverDiseaseAreas: {
                  some: {
                    diseaseAreaId: {
                      in: sml.platformProductOrder.platformProductOrderDiseaseAreas.map(
                        (da) => da.diseaseAreaId,
                      ),
                    },
                  },
                },
              },
            },
            {
              //* Get all Doctor and Nurse posts that have PostDiseaseArea in SML or none
              stakeholder: {
                type: {
                  in: [StakeholderType.Doctor, StakeholderType.Nurse],
                },
              },
              OR: [
                {
                  postDiseaseAreas: {
                    some: {
                      diseaseAreaId: {
                        in: sml.platformProductOrder.platformProductOrderDiseaseAreas.map(
                          (da) => da.diseaseAreaId,
                        ),
                      },
                    },
                  },
                },
                {
                  postDiseaseAreas: {
                    none: {},
                  },
                },
              ],
            },
          ],
        },
      ],
      stakeholder: {
        //* Get all valid and quality-assured posts that are on SMLs platforms
        isSML: true,
        isQA: true,
        socialPlatformId: {
          in: sml.SMLPlatforms.map((platform) => platform.socialPlatformId),
        },
      },
    };

    const queryInclude: Prisma.StakeholderPostInclude = {
      postBrands: true,
      postDiseaseAreas: true,
      postProducts: true,
      postStruggles: true,
      stakeholder: { include: { patientCaregiverDiseaseAreas: true } },
    };
    const queryOrderBy: Prisma.Enumerable<Prisma.StakeholderPostOrderByWithRelationInput> =
      (sortBy as any) || { createdAt: 'desc' };

    return filterRecordsFactory(
      this.prismaService,
      (tx) => tx.stakeholderPost,
      {
        where: queryWhere,
        include: queryInclude,
        orderBy: queryOrderBy,
        skip,
        take,
      },
    )();
  }
}
