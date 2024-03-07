import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { CreateProductOrderCommentDto } from './dto/create-product-order-comment.dto';
import { Prisma, User } from '@prisma/client';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    orderId: number,
    { comment }: CreateProductOrderCommentDto,
    author: User,
  ) {
    // check if product order exists
    const productOrder =
      await this.prismaService.platformProductOrder.findUniqueOrThrow({
        where: { id: orderId },
      });

    return await this.prismaService.platformProductOrderComment.create({
      data: {
        comment,
        userId: author.id,
        productOrderId: orderId,
      },
    });
  }

  async filter(orderId: number, { skip, take, sortBy }: FilterParamsDto) {
    const queryWhere: Prisma.PlatformProductOrderCommentWhereInput = {
      productOrderId: orderId,
    };
    const queryOrderBy: Prisma.Enumerable<Prisma.PlatformProductOrderCommentOrderByWithRelationInput> =
      // sort by comment time (descending) by the default
      (sortBy as any) || { createdAt: 'desc' };
    const queryInclude: Prisma.PlatformProductOrderCommentInclude = {
      // get the author basic info only, to increase query performance
      user: { select: { firstName: true, lastName: true, email: true } },
    };

    try {
      // check if product order exists
      const productOrder =
        await this.prismaService.platformProductOrder.findUniqueOrThrow({
          where: { id: orderId },
        });

      const result = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.platformProductOrderComment,
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

  async delete(id: number) {
    return await this.prismaService.platformProductOrderComment.delete({
      where: { id },
    });
  }
}
