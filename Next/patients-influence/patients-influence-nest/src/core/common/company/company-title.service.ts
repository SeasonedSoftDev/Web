import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { CreateCompanyTitleDto } from './dto';
import { CompanyTitle, Prisma } from '@prisma/client';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';

@Injectable()
export class CompanyTitleService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCompanyTitles(dto: CreateCompanyTitleDto[]) {
    const companyTitles = dto.map((companyTitle: CreateCompanyTitleDto) => {
      const { name } = companyTitle;
      return {
        name,
      };
    });

    return await this.prismaService.companyTitle.createMany({
      data: companyTitles,
      skipDuplicates: true,
    });
  }

  async findOneById(id: number) {
    return await this.prismaService.companyTitle.findUniqueOrThrow({
      where: { id },
    });
  }

  async findAll({
    skip,
    take,
    sortBy,
    search,
  }: FilterParamsDto): Promise<PaginationResult<CompanyTitle>> {
    const queryWhere: Prisma.CompanyTitleWhereInput = {
      name: { contains: search, mode: 'insensitive' },
    };

    const queryOrderBy: Prisma.Enumerable<Prisma.CompanyTitleOrderByWithRelationInput> =
      (sortBy as any) || { name: 'asc' };

    // const company = await this.prismaService.companyTitle.findMany({
    //   where: queryWhere,
    // });

    // if (!company.length) {
    //   queryWhere.name = { contains: 'Other', mode: 'insensitive' };
    // }

    // try {
    //   return await filterRecordsFactory(
    //     this.prismaService,
    //     (tx) => tx.companyTitle,
    //     {
    //       where: queryWhere,
    //       skip,
    //       take,
    //       orderBy: queryOrderBy,
    //     },
    //   )();

    try {
      const result = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.companyTitle,
        {
          where: queryWhere,
          skip,
          take,
          orderBy: queryOrderBy,
        },
      )();

      if (result.result.length) {
        return result;
      } else {
        const queryOther: Prisma.CompanyTitleWhereInput = {
          // will search through disease areas and disease area groups as name can be either of the two
          name: { contains: 'other', mode: 'insensitive' },
        };

        const otherResult = await filterRecordsFactory(
          this.prismaService,
          (tx) => tx.companyTitle,
          {
            where: queryOther,
            skip,
            take,
            orderBy: queryOrderBy,
          },
        )();

        return otherResult;
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(id: number) {
    return await this.prismaService.companyTitle.delete({
      where: { id },
    });
  }

  async deleteMany(ids: number[]) {
    return await this.prismaService.companyTitle.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
