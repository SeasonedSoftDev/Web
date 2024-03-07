import { Injectable } from '@nestjs/common';
import { DiseaseAreaDto } from './dto';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { PaginationParamsDto } from 'src/utils/object-definitions/dtos/pagination-params.dto';
import { DiseaseArea, Prisma } from '@prisma/client';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';

@Injectable()
export class DiseaseAreaService {
  constructor(private readonly prismaService: PrismaService) {}

  async createDiseaseAreas(dto: DiseaseAreaDto[]) {
    try {
      const diseaseAreas = dto.map((diseaseArea: DiseaseAreaDto) => {
        const { disease, isCommon, parentDiseaseAreaId } = diseaseArea;
        return {
          name: disease,
          isCommon,
          parentDiseaseAreaId,
        };
      });

      return await this.prismaService.diseaseArea.createMany({
        data: diseaseAreas,
        skipDuplicates: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: number) {
    return await this.prismaService.diseaseArea.findUniqueOrThrow({
      where: { id },
      include: { childDiseaseAreas: true, parentDiseaseArea: true },
    });
  }

  async findAll({
    skip,
    take,
    sortBy,
    search,
  }: FilterParamsDto): Promise<PaginationResult<DiseaseArea>> {
    const queryWhere: Prisma.DiseaseAreaWhereInput = {
      // will search through disease areas and disease area groups as name can be either of the two
      name: { contains: search, mode: 'insensitive' },
    };
    const queryInclude: Prisma.DiseaseAreaInclude = {
      // ! do not retrieve child disease areas as it can drastically increase response size
      // * it's important to get data enough to show disease area and a group where it belongs, or just a disease area group
      // childDiseaseAreas: true,
      parentDiseaseArea: true,
    };
    // ! queryOrderBy is WIP
    const queryOrderBy: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput> =
      (sortBy as any) || { name: 'asc' };

    try {
      const result = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.diseaseArea,
        {
          where: queryWhere,
          skip,
          take,
          include: queryInclude,
          orderBy: queryOrderBy,
        },
      )();

      if (result.result.length) {
        return result;
      } else {
        const queryOther: Prisma.DiseaseAreaWhereInput = {
          // will search through disease areas and disease area groups as name can be either of the two
          name: { contains: 'other', mode: 'insensitive' },
        };
        const otherResult = await filterRecordsFactory(
          this.prismaService,
          (tx) => tx.diseaseArea,
          {
            where: queryOther,
            skip,
            take,
            include: queryInclude,
            orderBy: queryOrderBy,
          },
        )();

        return otherResult;
      }
    } catch (error) {
      throw error;
    }
  }
}
