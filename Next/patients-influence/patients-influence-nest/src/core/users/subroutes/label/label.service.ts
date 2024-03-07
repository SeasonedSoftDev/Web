import { Injectable } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-user-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { UsersService } from '../../users.service';
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
    private readonly usersService: UsersService,
    private readonly commonLabelsService: LabelsService,
  ) {}

  /*
  async create(userId: number, labelId: number, author: User) {
    // check if user exists
    const user = await this.usersService.findOneById(userId, true);

    return await this.prismaService.userLabel.create({
      data: {
        labelOptionId: labelId,
        assignerId: author.id,
        assigneeId: userId,
      },
    });
  }

  async createMany(userId: number, labelIds: number[], author: User) {
    // check if user exists
    const user = await this.usersService.findOneById(userId, true);

    return await this.prismaService.userLabel.createMany({
      data: labelIds.map((labelId) => ({
        labelOptionId: labelId,
        assignerId: author.id,
        assigneeId: userId,
      })),
      skipDuplicates: true,
    });
  }
  */

  async filter(
    userId: number,
    { skip, take, sortBy }: FilterParamsDto,
  ): Promise<PaginationResult<UserLabel>> {
    const queryWhere: Prisma.UserLabelWhereInput = { assigneeId: userId };
    const queryOrderBy: Prisma.Enumerable<Prisma.UserLabelOrderByWithRelationInput> =
      // sort by comment time (descending) by the default
      (sortBy as any) || { createdAt: 'desc' };
    const queryInclude: Prisma.UserLabelInclude = {
      // get the author basic info only, to increase query performance
      assignerUser: {
        select: { firstName: true, lastName: true, email: true },
      },
      label: { select: { name: true } },
    };

    try {
      // check if user exists
      const user = await this.usersService.findOneById(userId, true);

      const result = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.userLabel,
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

  /*
  async deleteOne(id: number) {
    return await this.prismaService.userLabel.delete({
      where: { id },
    });
  }

  async deleteMany(ids: number[]) {
    return await this.prismaService.userLabel.deleteMany({
      where: { id: { in: ids } },
    });
  }
  */

  async update(userId: number, labelIds: number[], author: User) {
    return await this.prismaService.$transaction(async (tx) => {
      const unconnectedLabels = await tx.userLabel.deleteMany({
        where: { assigneeId: userId, labelId: { notIn: labelIds } },
      });

      await Promise.all(
        labelIds.map(async (labelId) => {
          // check if label is of proper type
          // TODO optimize this
          const label = await this.commonLabelsService.findOneById(labelId);

          if (label.assigneeType !== AssigneeType.User) {
            throw new ApplicationException(
              `A label has a wrong type (expected type: ${AssigneeType.User}): ${labelId}`,
            );
          }
        }),
      );

      const userLabels = await tx.userLabel.createMany({
        data: labelIds.map((labelId) => ({
          labelId: labelId,
          assignerId: author.id,
          assigneeId: userId,
        })),
        skipDuplicates: true,
      });

      return {
        count: unconnectedLabels.count + userLabels.count,
      } as Prisma.BatchPayload;
    });
  }
}
