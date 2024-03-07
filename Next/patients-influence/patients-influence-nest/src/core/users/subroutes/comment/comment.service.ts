import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { CreateUserCommentDto } from './dto/create-user-comment.dto';
import { Prisma, User } from '@prisma/client';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { UsersService } from '../../users.service';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    userId: number,
    { comment }: CreateUserCommentDto,
    author: User,
  ) {
    // check if user exists
    const user = await this.usersService.findOneById(userId, true);

    return await this.prismaService.userComment.create({
      data: {
        text: comment,
        userId: author.id,
        targetId: userId,
      },
    });
  }

  async filter(userId: number, { skip, take, sortBy }: FilterParamsDto) {
    const queryWhere: Prisma.UserCommentWhereInput = { userId };
    const queryOrderBy: Prisma.Enumerable<Prisma.UserCommentOrderByWithRelationInput> =
      // sort by comment time (descending) by the default
      (sortBy as any) || { createdAt: 'desc' };
    const queryInclude: Prisma.UserCommentInclude = {
      // get the author basic info only, to increase query performance
      user: { select: { firstName: true, lastName: true, email: true } },
    };

    try {
      // check if user exists
      const user = await this.usersService.findOneById(userId, true);

      const result = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.userComment,
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
    return await this.prismaService.userComment.delete({
      where: { id },
    });
  }
}
