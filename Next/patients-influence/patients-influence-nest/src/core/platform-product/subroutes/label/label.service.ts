import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { Prisma, User, UserLabel } from '@prisma/client';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { LabelsService } from 'src/core/common/labels/labels.service';
import { AssigneeType } from 'src/core/common/labels/enums/asignee-type.enum';
import { ApplicationException } from 'src/exceptions/application.exception';
import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';

@Injectable()
export class LabelService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly commonLabelsService: LabelsService,
  ) {}

  async filter(
    orderId: number,
    { skip, take, sortBy }: FilterParamsDto,
  ): Promise<PaginationResult<UserLabel>> {
    const queryWhere: Prisma.PlatformProductOrderLabelWhereInput = {
      platformProductOrderId: orderId,
    };
    const queryOrderBy: Prisma.Enumerable<Prisma.PlatformProductOrderLabelOrderByWithRelationInput> =
      // sort by comment time (descending) by the default
      (sortBy as any) || { createdAt: 'desc' };
    const queryInclude: Prisma.PlatformProductOrderLabelInclude = {
      // get the author basic info only, to increase query performance
      assigner: {
        select: { firstName: true, lastName: true, email: true },
      },
      label: { select: { name: true } },
    };

    try {
      // check if product order exists
      const productOrder =
        await this.prismaService.platformProductOrder.findUniqueOrThrow({
          where: { id: orderId },
        });

      const result = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.platformProductOrderLabel,
        {
          where: queryWhere,
          skip,
          take,
          orderBy: queryOrderBy,
          include: queryInclude,
        },
      )();

      return result;
    } catch (err) {
      throw err;
    }
  }

  async update(orderId: number, labelIds: number[], author: User) {
    return await this.prismaService.$transaction(async (tx) => {
      const unconnectedLabels = await tx.platformProductOrderLabel.deleteMany({
        where: {
          platformProductOrderId: orderId,
          labelId: { notIn: labelIds },
        },
      });

      await Promise.all(
        labelIds.map(async (labelId) => {
          // check if label is of proper type
          // TODO optimize this
          const label = await this.commonLabelsService.findOneById(labelId);

          if (label.assigneeType !== AssigneeType.PlatformProduct) {
            throw new ApplicationException(
              `A label has a wrong type (expected type: ${AssigneeType.PlatformProduct}): ${labelId}`,
            );
          }
        }),
      );

      const productOrderLabels = await tx.platformProductOrderLabel.createMany({
        data: labelIds.map((labelId) => ({
          labelId: labelId,
          assignerId: author.id,
          platformProductOrderId: orderId,
        })),
        skipDuplicates: true,
      });

      return {
        count: unconnectedLabels.count + productOrderLabels.count,
      } as Prisma.BatchPayload;
    });
  }
}
