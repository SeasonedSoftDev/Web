import { Injectable } from '@nestjs/common';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { Prisma, Symptom } from '@prisma/client';
import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { PrismaService } from 'src/integrations/prisma/prisma.service';

@Injectable()
export class SymptomsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createSymptomDto: CreateSymptomDto) {
    return 'This action adds a new symptom';
  }

  async findAll({
    skip,
    take,
    sortBy,
    search,
  }: FilterParamsDto): Promise<PaginationResult<Symptom>> {
    const queryWhere: Prisma.SymptomWhereInput = {
      name: { contains: search, mode: 'insensitive' },
    };
    const queryOrderBy: Prisma.Enumerable<Prisma.SymptomOrderByWithRelationInput> =
      (sortBy as any) || { name: 'asc' };

    return await filterRecordsFactory(this.prismaService, (tx) => tx.symptom, {
      where: queryWhere,
      skip,
      take,
      orderBy: queryOrderBy,
    })();
  }

  findOne(id: number) {
    return `This action returns a #${id} symptom`;
  }

  update(id: number, updateSymptomDto: UpdateSymptomDto) {
    return `This action updates a #${id} symptom`;
  }

  remove(id: number) {
    return `This action removes a #${id} symptom`;
  }
}
