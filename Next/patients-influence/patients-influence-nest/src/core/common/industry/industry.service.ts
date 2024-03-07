import { Injectable } from '@nestjs/common';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { Prisma } from '@prisma/client';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';

@Injectable()
export class IndustryService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createIndustryDto: CreateIndustryDto) {
    return 'This action adds a new industry';
  }

  async findAll({ skip, take, sortBy, search }: FilterParamsDto) {
    const queryWhere: Prisma.IndustryWhereInput = {
      name: { contains: search, mode: 'insensitive' },
    };
    const queryOrderBy: Prisma.Enumerable<Prisma.IndustryOrderByWithRelationInput> =
      (sortBy as any) || { name: 'asc' };

    const response = await filterRecordsFactory(
      this.prismaService,
      (tx) => tx.industry,
      {
        where: queryWhere,
        skip,
        take,
        orderBy: queryOrderBy,
      },
    )();

    return response;
  }

  findOne(id: number) {
    return `This action returns a #${id} industry`;
  }

  update(id: number, updateIndustryDto: UpdateIndustryDto) {
    return `This action updates a #${id} industry`;
  }

  remove(id: number) {
    return `This action removes a #${id} industry`;
  }
}
