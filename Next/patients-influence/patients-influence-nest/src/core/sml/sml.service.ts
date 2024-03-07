import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { PlatformProductOrderService } from '../platform-product/platform-product-order.service';
import { SmlStatus } from 'src/utils/enums/sml-status.enum';
import { Prisma, User } from '@prisma/client';
import { UserRole } from 'src/utils';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { StakeholderPostsService } from '../stakeholders/stakeholder-posts.service';
import { SmlWithType } from './types/sml-with.type';
import { CreateSMLDto, SmlPostsFilterDto, UpdateSMLDto } from './dto';
import { UserEntity } from '../users/entities/user.entity';
import { SmlIncludeType } from './types/sml-include.type';
import { NotificationsService } from '../notifications/notifications.service';
import { SMLFilterDto } from './dto/sml-filter.dto';
import { CreditPackage } from './enums/credit-package.enum';
import { BadRequestApplicationException } from 'src/exceptions/application.exception';
import { Status } from '../campaign/enums';
import { DeleteManySMLsDto } from './dto/delete-many-smls.dto';
import { PlatformProduct } from '../platform-product/enums/platform-product.enum';
import { FindByIdsDto } from '../finance/dto/find-by-ids.dto';
import { SocialPlatform } from '../stakeholders/enums/social-platform.enum';

@Injectable()
export class SMLService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly platformProductOrderService: PlatformProductOrderService,
    private readonly stakeholderPostsService: StakeholderPostsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  static queryInclude: Prisma.SocialMediaListeningInclude = {
    platformProductOrder: {
      include: PlatformProductOrderService.queryInclude,
    },
    clientSMLTokenBalances: true,
    SMLPlatforms: true,
  };

  static querySelect: Prisma.SocialMediaListeningSelect = {
    platformProductOrder: { select: PlatformProductOrderService.querySelect },
    clientSMLTokenBalances: true,
    subscriptionLength: true,
    startedAt: true,
    smlDescription: true,
    monthlyTokens: true,
    createdAt: true,
    updatedAt: true,
    SMLPlatforms: true,
    id: true,
  };

  async createSml(createSmlDto: CreateSMLDto, user: UserEntity) {
    if (
      user.role === UserRole.Ambassador ||
      user.role === UserRole.Influencer
    ) {
      throw new UnauthorizedException();
    }

    const {
      budget,
      clientId,
      diseaseAreas,
      platforms,
      monthlyTokens,
      smlDescription,
      subscriptionLength,
    } = createSmlDto;

    if (
      (user.role == UserRole.SuperAdmin || user.role == UserRole.Admin) &&
      clientId === undefined
    ) {
      throw new BadRequestException(
        'clientId must be specified when an admin is submitting the request!',
      );
    } else if (user.role === UserRole.Client && monthlyTokens !== undefined) {
      // reference: https://bobbyhadz.com/blog/typescript-get-enum-values-as-array
      const allowedCreditValues = Object.keys(CreditPackage)
        .filter((v) => !isNaN(Number(v)))
        .map((v) => parseInt(v));
      if (!allowedCreditValues.includes(monthlyTokens)) {
        throw new BadRequestApplicationException(
          `Number of tokens must have one one of the following values: ${allowedCreditValues.join(
            ', ',
          )}`,
        );
      }
    }

    const sml = await this.prismaService.$transaction(async (tx) => {
      const { _count } = await tx.stakeholder.aggregate({
        where: {
          patientCaregiverDiseaseAreas: {
            some: {
              diseaseAreaId: {
                in: diseaseAreas,
              },
            },
          },
        },
        _count: { id: true },
      });

      const productOrder =
        await this.platformProductOrderService.createPlatformProductOrder(
          {
            budget,
            clientId: user.role === UserRole.Client ? user.client.id : clientId,
            diseaseAreas: diseaseAreas,
            platformProduct: PlatformProduct.SocialMediaListening,
            status: _count.id > 99 ? Status.Ready : Status.Ordered,
          },
          tx,
        );

      return await tx.socialMediaListening.create({
        data: {
          subscriptionLength,
          monthlyTokens,
          smlDescription,
          platformProductOrder: { connect: { id: productOrder.id } },
          SMLPlatforms: {
            createMany: {
              data: platforms.map((platform) => {
                return { socialPlatformId: platform };
              }),
              skipDuplicates: true,
            },
          },
        },
        include: SMLService.queryInclude,
      });
    });

    await this.notificationsService.smlOrdered(sml.id);
    return sml;
  }

  async findAll(
    { skip, take, sortBy }: FilterParamsDto,
    filters: SMLFilterDto,
    user: User,
  ) {
    let queryWhere: Prisma.SocialMediaListeningWhereInput = {
      platformProductOrder: { status: filters.status },
    };
    const queryOrderBy: Prisma.Enumerable<Prisma.SocialMediaListeningOrderByWithRelationInput> =
      (sortBy as any) || { createdAt: 'desc' };

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

    const result = await filterRecordsFactory(
      this.prismaService,
      (tx) => tx.socialMediaListening,
      {
        skip,
        take,
        orderBy: queryOrderBy,
        select: SMLService.querySelect,
        where: queryWhere,
      },
    )();

    return result;
  }

  async findOneById(
    id: number,
    user?: UserEntity,
    include?: SmlIncludeType,
    tx?: Omit<
      PrismaService,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
  ): Promise<SmlWithType> {
    let queryWhere: Prisma.SocialMediaListeningWhereInput = { id };

    if (user.role === UserRole.Client) {
      const client = await (tx || this.prismaService).client.findFirstOrThrow({
        where: { userId: user.id },
      });
      queryWhere = {
        id,
        platformProductOrder: { clientId: client.id },
      };
    }

    return await (
      tx || this.prismaService
    ).socialMediaListening.findFirstOrThrow({
      where: queryWhere,
      include: include || SMLService.queryInclude,
    });
  }

  async updateById(id: number, updateSmlDto: UpdateSMLDto) {
    const {
      monthlyTokens,
      smlDescription,
      status,
      subscriptionLength,
      budget,
      diseaseAreas,
      platforms,
      productId,
    } = updateSmlDto;

    if (!(status in SmlStatus)) {
      throw new BadRequestException('Status must be a valid SmlStatus');
    }

    if (!Object.values(SmlStatus).includes(status)) {
      throw new BadRequestException();
    }

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

      return {
        ...(condition !== undefined
          ? condition !== null
            ? {
                deleteMany: {
                  NOT: { [connectOrCreateField]: { in: condition } },
                },
                createMany: { data: map, skipDuplicates: true },
              }
            : { deleteMany: { id } }
          : {}),
      };
    };

    const sml = await this.prismaService.$transaction(async (tx) => {
      await this.platformProductOrderService.updateOneById(
        productId,
        { budget, diseaseAreas },
        tx,
      );

      return await tx.socialMediaListening.update({
        where: { id },
        data: {
          monthlyTokens,
          smlDescription,
          subscriptionLength,
          platformProductOrder: {
            update: {
              status,
            },
          },
          startedAt: status === SmlStatus.Delivered ? new Date() : undefined,
          SMLPlatforms: generateDeleteManyAndCreateMany(
            platforms,
            'socialPlatformId',
          ),
        },
        include: {
          ...SMLService.queryInclude,
          platformProductOrder: {
            include: {
              client: {
                include: {
                  user: true,
                  ambassador: true,
                },
              },
            },
          },
        },
      });
    });
    if (sml.platformProductOrder.status === SmlStatus.Delivered) {
      await this.notificationsService.smlDelivered(
        sml.platformProductOrder.client.userId,
        sml.id,
        sml.platformProductOrder.client.ambassador?.userId,
      );
    }

    return sml;
  }

  async deleteMany(dto: DeleteManySMLsDto) {
    const { smlIds } = dto;

    try {
      const existingSMLs =
        await this.prismaService.socialMediaListening.findMany({
          where: {
            id: { in: smlIds },
          },
          select: {
            id: true,
          },
        });

      const existingSMLIds = existingSMLs.map((sml) => sml.id);
      const missingSMLIds = smlIds.filter(
        (smlId) => !existingSMLIds.includes(smlId),
      );

      if (missingSMLIds.length > 0) {
        throw new NotFoundException(
          `SMLs with IDs ${missingSMLIds.join(', ')} not found.`,
        );
      }

      const deletedSMLs =
        await this.prismaService.socialMediaListening.deleteMany({
          where: {
            id: {
              in: smlIds,
            },
          },
        });

      return deletedSMLs;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: number, user: UserEntity) {
    if (user.role === UserRole.Client) {
      throw new UnauthorizedException('Only an admin can perform this action!');
    }

    const queryWhere: Prisma.SocialMediaListeningWhereInput = { id };

    return await this.prismaService.socialMediaListening.deleteMany({
      where: queryWhere,
    });
  }

  async findPostsBySMLId(
    id: number,
    user: UserEntity,
    filters: SmlPostsFilterDto,
    filterParams: FilterParamsDto,
  ) {
    const include: SmlIncludeType = {
      platformProductOrder: {
        include: { platformProductOrderDiseaseAreas: true },
      },
      SMLPlatforms: true,
    };

    const sml: SmlWithType = await this.findOneById(id, user, include);

    if (
      user.role === UserRole.Client &&
      (sml.platformProductOrder.status !== SmlStatus.Delivered ||
        user.client === undefined ||
        user.client.id !== sml.platformProductOrder.clientId)
    )
      throw new UnauthorizedException();

    return await this.stakeholderPostsService.findPostsForSML(
      filters,
      sml,
      filterParams,
    );
  }

  async exportSMLs(dto: FindByIdsDto, user: UserEntity) {
    let queryWhere: Prisma.SocialMediaListeningWhereInput = {
      id: { in: dto.ids },
      platformProductOrder: { status: dto.status },
    };

    const queryInclude = {
      platformProductOrder: {
        include: {
          platformProductOrderDiseaseAreas: {
            include: {
              diseaseArea: true,
            },
          },
          client: {
            include: {
              user: true,
            },
          },
        },
      },
      SMLPlatforms: {
        include: {
          socialPlatform: true,
        },
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

    const smls = await this.prismaService.socialMediaListening.findMany({
      where: queryWhere,
      include: queryInclude,
    });

    const handleSocialPlatform = (sml) => {
      switch (sml) {
        case SocialPlatform.Instagram:
          return 'Instagram';
        case SocialPlatform.TikTok:
          return 'TikTok';
        case SocialPlatform.Twitter:
          return 'Twitter';
        default:
          return 'Unknown';
      }
    };

    return smls?.map((sml) => {
      return {
        subscription: `${sml.subscriptionLength} months`,
        tokens: sml.monthlyTokens,
        diseaseArea:
          sml.platformProductOrder.platformProductOrderDiseaseAreas[0]
            .diseaseArea.name,
        budget: sml.platformProductOrder.budget
          ? sml.platformProductOrder.budget.toNumber()
          : 0,
        client: `${sml.platformProductOrder.client.user.firstName} ${sml.platformProductOrder.client.user.lastName}`,
        platform: handleSocialPlatform(sml.SMLPlatforms[0].socialPlatformId),
        description: sml.smlDescription,
      };
    });
  }
}
