import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../integrations/prisma/prisma.service';
import {
  CreateBenefitCateogryDto,
  CreateBenefitDto,
  CreateBenefitSuggestionDto,
  EditBenefitCateogryDto,
  EditBenefitDto,
  EditBenefitSuggestionDto,
} from './dto';
import { Prisma, User } from '@prisma/client';
import { UserRole, formatCrud } from 'src/utils';
import { FilterParamsDto } from '../../utils/object-definitions/dtos/filter-params.dto';
import { filterRecordsFactory } from '../../utils/factories/filter-records.factory';
import { UserEntity } from '../users/entities/user.entity';
import { GetBenefitSuggestionsFilterDto } from './dto/get-benefit-suggestions-filter.dto';
import {
  BadRequestApplicationException,
  ForbiddenApplicationException,
} from 'src/exceptions/application.exception';
import { DeleteApproveManySuggestionsDto } from './dto/delete-approve-many-suggestions.dto';
import { DeleteManyBenefitsDto } from './dto/delete-many-benefits.dto';
import { FindByIdsDto } from '../finance/dto/find-by-ids.dto';
import { BenefitFilterDto } from './dto/benefit-filter.dto';

@Injectable()
export class BenefitService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBenefits({
    skip,
    take,
    sortBy,
    search,
    category,
    location,
  }: BenefitFilterDto) {
    const queryOrderBy: Prisma.Enumerable<Prisma.BenefitOrderByWithRelationInput> =
      (sortBy as any) || { createdAt: 'desc' };
    const queryInclude: Prisma.BenefitInclude = {
      benefitCategory: true,
      benefitLocations: {
        include: {
          location: {
            include: {
              country: true,
            },
          },
        },
      },
      benefitPartnership: true,
    };

    // const queryWhere: Prisma.BenefitWhereInput = {
    //   description: search.length ? search : undefined,
    // };

    const queryWhere: Prisma.BenefitWhereInput = {
      AND: [
        category
          ? {
              benefitCategory: {
                id: +category.value,
              },
            }
          : undefined,
        location
          ? {
              OR: [
                {
                  benefitLocations: {
                    some: {
                      location: {
                        id: +location.value,
                      },
                    },
                  },
                },
                {
                  benefitLocations: {
                    some: {
                      location: {
                        country: {
                          id: +location.value,
                        },
                      },
                    },
                  },
                },
              ],
            }
          : undefined,
      ],
      OR: [
        {
          description: {
            contains: search, // Search in the description field
            mode: 'insensitive', // Perform case-insensitive search
          },
        },
        {
          benefitPartnership: {
            name: {
              contains: search, // Search in the partner's name field
              mode: 'insensitive', // Perform case-insensitive search
            },
          },
        },
      ],
    };

    try {
      const result = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.benefit,
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

  async getBenefit(id: number) {
    const benefit = await this.prismaService.benefit.findFirstOrThrow({
      where: { id },
      include: {
        benefitCategory: true,
        benefitPartnership: true,
        benefitLocations: {
          include: {
            location: true,
          },
        },
      },
    });
    return benefit;
  }

  async createBenefit(dto: CreateBenefitDto) {
    const {
      benefitPartnership,
      benefitCategoryId,
      benefitCompanyLink,
      description,
      benefitLocations = [],
    } = dto;

    return await this.prismaService.$transaction(async (tx) => {
      let setBenefitPartnership;

      if (!benefitPartnership.id) {
        setBenefitPartnership = await tx.benefitPartnership.create({
          data: {
            name: benefitPartnership.name,
          },
          select: {
            id: true,
            name: true,
          },
        });
      }

      if (benefitPartnership.id) {
        setBenefitPartnership = await tx.benefitPartnership.findUnique({
          where: {
            id: benefitPartnership.id,
          },
          select: {
            id: true,
            name: true,
          },
        });
      }
      return await tx.benefit.create({
        data: {
          benefitPartnershipId: (await setBenefitPartnership).id,
          benefitCategoryId,
          benefitCompanyLink,
          description,
          benefitLocations: {
            createMany: {
              data: benefitLocations.map((x) => ({ locationId: x })),
            },
          },
        },
        include: {
          benefitCategory: true,
          benefitPartnership: true,
          benefitLocations: {
            include: {
              location: true,
            },
          },
        },
      });
    });
  }

  async deleteManyBenefits(dto: DeleteManyBenefitsDto, user: UserEntity) {
    const { benefitIds } = dto;

    if (user.role !== UserRole.SuperAdmin) {
      throw new ForbiddenApplicationException(
        'Only admin has access to this feature.',
      );
    }

    return await this.prismaService.$transaction(async (tx) => {
      const benefitsToBeDeleted = await tx.benefit.findMany({
        where: {
          id: {
            in: benefitIds,
          },
        },
        select: {
          id: true,
        },
      });

      if (benefitsToBeDeleted.length) {
        return await tx.benefit.deleteMany({
          where: {
            id: {
              in: benefitsToBeDeleted.map((benefit) => benefit.id),
            },
          },
        });
      }
    });
  }

  async editBenefit(id: number, dto: EditBenefitDto) {
    const {
      benefitCategoryId,
      benefitCompanyLink,
      benefitPartnership,
      description,
      benefitLocations,
    } = dto;
    return await this.prismaService.benefit.update({
      where: {
        id,
      },
      data: {
        benefitCategoryId,
        benefitCompanyLink,
        benefitPartnershipId: benefitPartnership.id,
        description,
        benefitLocations: formatCrud({
          array: benefitLocations,
          notIn: ['locationId'],
          where: { benefitId: id },
          create: (locationId: number) => ({
            locationId,
          }),
        }),
      },
    });
  }

  async deleteBenefit(id: number) {
    return await this.prismaService.benefit.delete({ where: { id } });
  }

  async getBenefitPartnerships({ skip, take, sortBy }: FilterParamsDto) {
    const queryOrderBy: Prisma.Enumerable<Prisma.BenefitPartnershipOrderByWithRelationInput> =
      (sortBy as any) || { createdAt: 'desc' };

    try {
      const result = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.benefitPartnership,
        {
          skip,
          take,
          orderBy: queryOrderBy,
        },
      )();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getBenefitSuggestions(
    { skip, take, sortBy, status }: GetBenefitSuggestionsFilterDto,
    user: UserEntity,
  ) {
    const queryOrderBy: Prisma.Enumerable<Prisma.BenefitSuggestionOrderByWithRelationInput> =
      (sortBy as any) || { createdAt: 'desc' };
    const queryInclude: Prisma.BenefitSuggestionInclude = {
      benefitUpvoteCounts: true,
      author:
        user.role === UserRole.SuperAdmin
          ? {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                influencer: {
                  select: {
                    id: true,
                    stakeholders: {
                      select: {
                        id: true,
                        socialPlatformUsername: true,
                      },
                    },
                  },
                },
              },
            }
          : undefined,
    };

    const allInfluencerBenefitSuggestions =
      await this.prismaService.benefitSuggestion.findMany({
        select: {
          id: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              locationId: true,
              role: true,
              status: true,
              location: {
                include: {
                  country: true,
                },
              },
            },
          },
          authorId: true,
          isApproved: true,
        },
      });

    const influencerSuggestions = allInfluencerBenefitSuggestions.filter(
      (suggestion) => {
        if (
          user.role === UserRole.Influencer &&
          suggestion.authorId === user.id
        ) {
          return suggestion;
        }
        if (suggestion.authorId !== user.id && suggestion.isApproved) {
          return suggestion;
        }
      },
    );

    const influencerBenefitSuggestionIds = influencerSuggestions.map(
      (suggestion) => suggestion.id,
    );

    const queryWhere: Prisma.BenefitSuggestionWhereInput =
      user.role === UserRole.SuperAdmin
        ? {
            isApproved: status ? true : false,
          }
        : {
            id: {
              in: influencerBenefitSuggestionIds,
            },
          };

    try {
      const result = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.benefitSuggestion,
        {
          skip,
          take,
          orderBy: queryOrderBy,
          include: queryInclude,
          where: queryWhere,
        },
      )();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getBenefitSuggestion(id: number) {
    return await this.prismaService.benefitSuggestion.findFirstOrThrow({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  async createBenefitSuggestion(
    authorId: number,
    dto: CreateBenefitSuggestionDto,
    user: UserEntity,
  ) {
    const {
      partnershipName,
      partnershipLink,
      argumentDescription,
      outcomeDescription,
    } = dto;

    return await this.prismaService.benefitSuggestion.create({
      data: {
        authorId,
        partnershipName,
        partnershipLink,
        argumentDescription,
        outcomeDescription,
        isApproved: user.role === UserRole.SuperAdmin ? true : false,
      },
    });
  }

  async editBenefitSuggestion(id: number, dto: EditBenefitSuggestionDto) {
    const {
      argumentDescription,
      outcomeDescription,
      partnershipLink,
      partnershipName,
      statusDescription,
      isApproved,
    } = dto;

    return await this.prismaService.benefitSuggestion.update({
      where: {
        id,
      },
      data: {
        argumentDescription,
        outcomeDescription,
        partnershipLink,
        partnershipName,
        statusDescription,
        isApproved,
      },
    });
  }

  async approveBenefitSuggestion(id: number, user: UserEntity) {
    if (user.role !== UserRole.SuperAdmin) {
      throw new ForbiddenApplicationException(
        'Only admin can approve suggestions.',
      );
    }

    const benefitSuggestion =
      await this.prismaService.benefitSuggestion.findUniqueOrThrow({
        where: {
          id,
        },
      });

    if (benefitSuggestion.isApproved) {
      throw new BadRequestApplicationException(
        'This suggestion is already approved.',
      );
    }

    return await this.prismaService.benefitSuggestion.update({
      where: {
        id: benefitSuggestion.id,
      },
      data: {
        isApproved: true,
      },
    });
  }

  async approveManyBenefitSuggestions(
    dto: DeleteApproveManySuggestionsDto,
    user: UserEntity,
  ) {
    const { suggestionIds } = dto;
    if (user.role !== UserRole.SuperAdmin) {
      throw new ForbiddenApplicationException(
        'Only admin can approve suggestions.',
      );
    }

    return await this.prismaService.$transaction(async (tx) => {
      const benefitSuggestions = await tx.benefitSuggestion.findMany({
        where: {
          id: {
            in: suggestionIds,
          },
        },
      });

      if (benefitSuggestions.find((suggestion) => suggestion.isApproved)) {
        throw new BadRequestApplicationException(
          'This suggestion is already approved.',
        );
      }

      return await tx.benefitSuggestion.updateMany({
        where: {
          id: {
            in: suggestionIds,
          },
        },
        data: {
          isApproved: true,
        },
      });
    });
  }

  async deleteBenefitSuggestion(id: number) {
    return await this.prismaService.benefitSuggestion.delete({ where: { id } });
  }

  async deleteManyBenefitSuggestions(
    dto: DeleteApproveManySuggestionsDto,
    user: UserEntity,
  ) {
    const { suggestionIds } = dto;
    if (user.role !== UserRole.SuperAdmin) {
      throw new ForbiddenApplicationException(
        'Only admin has access to this feature.',
      );
    }

    return await this.prismaService.$transaction(async (tx) => {
      const suggestionsToBeDeleted = await tx.benefitSuggestion.findMany({
        where: {
          id: {
            in: suggestionIds,
          },
        },
        select: {
          id: true,
        },
      });

      if (suggestionsToBeDeleted.length) {
        return await tx.benefitSuggestion.deleteMany({
          where: {
            id: {
              in: suggestionsToBeDeleted.map((suggestion) => suggestion.id),
            },
          },
        });
      }
    });
  }

  async upvoteBenefitSuggestion(benefitSuggestionId: number, userId: number) {
    await this.prismaService.benefitSuggestion.findFirstOrThrow({
      where: { id: benefitSuggestionId },
    });

    const upvote = await this.prismaService.benefitUpvoteCount.findFirst({
      where: {
        benefitSuggestionId,
        userId,
      },
    });

    if (upvote && !upvote.isUpvoted) {
      await this.prismaService.benefitUpvoteCount.update({
        where: { id: upvote.id },
        data: { isUpvoted: true },
      });
      return { isUpvoted: true };
    } else if (upvote && upvote.isUpvoted) {
      await this.prismaService.benefitUpvoteCount.delete({
        where: { id: upvote.id },
      });
      return { isUpvoted: null };
    } else if (!upvote) {
      await this.prismaService.benefitUpvoteCount.create({
        data: { benefitSuggestionId, userId, isUpvoted: true },
      });
      return { isUpvoted: true };
    }
  }

  async downvoteBenefitSuggestion(benefitSuggestionId: number, userId: number) {
    await this.prismaService.benefitSuggestion.findFirstOrThrow({
      where: { id: benefitSuggestionId },
    });

    const downvote = await this.prismaService.benefitUpvoteCount.findFirst({
      where: {
        benefitSuggestionId,
        userId,
      },
    });

    if (downvote && downvote.isUpvoted) {
      await this.prismaService.benefitUpvoteCount.update({
        where: { id: downvote.id },
        data: { isUpvoted: false },
      });
      return { isUpvoted: false };
    } else if (downvote && !downvote.isUpvoted) {
      await this.prismaService.benefitUpvoteCount.delete({
        where: { id: downvote.id },
      });
      return { isUpvoted: null };
    } else if (!downvote) {
      await this.prismaService.benefitUpvoteCount.create({
        data: { benefitSuggestionId, userId, isUpvoted: false },
      });
      return { isUpvoted: false };
    }
  }

  async getBenefitCategories() {
    return await this.prismaService.benefitCategory.findMany();
  }

  async createBenefitCategory(dto: CreateBenefitCateogryDto) {
    const { name } = dto;
    return await this.prismaService.benefitCategory.create({ data: { name } });
  }

  async editBenefitCategory(id: number, dto: EditBenefitCateogryDto) {
    const { name } = dto;

    const benefit = await this.prismaService.benefitCategory.update({
      where: { id },
      data: { name },
    });

    return benefit;
  }

  async deleteBenefitCategory(id: number) {
    const benefit = await this.prismaService.benefitCategory.delete({
      where: { id },
    });

    return benefit;
  }

  async export(dto: FindByIdsDto) {
    const queryWhere: Prisma.BenefitWhereInput = {
      id: {
        in: dto.ids,
      },
    };

    const benefits = await this.prismaService.benefit.findMany({
      where: queryWhere,
      include: {
        benefitCategory: true,
        benefitLocations: {
          include: {
            location: true,
          },
        },
        benefitPartnership: true,
      },
    });

    return benefits?.map((benefit) => {
      return {
        category: benefit.benefitCategory?.name,
        partnership: benefit.benefitPartnership?.name,
        companyLink: benefit.benefitCompanyLink,
        description: benefit.description,
        locations:
          benefit.benefitLocations.length > 0
            ? benefit.benefitLocations
                .map((location) => location.location.name)
                .join(' | ')
            : '',
      };
    });
  }
}
