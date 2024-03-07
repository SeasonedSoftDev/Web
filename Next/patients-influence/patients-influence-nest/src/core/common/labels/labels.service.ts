import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { Label, Prisma } from '@prisma/client';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { LabelFilterParamsDto } from './dto/query/label-filter-params.dto';

@Injectable()
export class LabelsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMany(dto: CreateLabelDto[]) {
    return await this.prismaService.label.createMany({
      data: dto,
      skipDuplicates: true,
    });
  }

  async findOneById(id: number) {
    return await this.prismaService.label.findUniqueOrThrow({
      where: { id },
    });
  }

  async findOneByName(name: string) {
    return await this.prismaService.label.findFirstOrThrow({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  async findMany(
    { skip, take, sortBy, search }: FilterParamsDto,
    { assigneeType }: LabelFilterParamsDto,
  ): Promise<PaginationResult<Label>> {
    const queryWhere: Prisma.LabelWhereInput = {
      name: { contains: search, mode: 'insensitive' },
      assigneeType: assigneeType,
    };
    const queryOrderBy: Prisma.Enumerable<Prisma.LabelOrderByWithRelationInput> =
      (sortBy as any) || { name: 'asc' };

    return await filterRecordsFactory(this.prismaService, (tx) => tx.label, {
      where: queryWhere,
      skip,
      take,
      orderBy: queryOrderBy,
    })();
  }

  async deleteOne(id: number) {
    return await this.prismaService.label.delete({
      where: { id },
    });
  }

  async deleteMany(ids: number[]) {
    return await this.prismaService.label.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
