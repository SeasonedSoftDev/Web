import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { LocationDto } from './dto';
import { PaginationParamsDto } from 'src/utils/object-definitions/dtos/pagination-params.dto';
import { Prisma } from '@prisma/client';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';

@Injectable()
export class LocationService {
  constructor(private readonly prismaService: PrismaService) {}
  static readonly queryInclude: Prisma.LocationInclude = {
    cities: true,
    country: true,
  };

  async createLocations(dto: LocationDto[]) {
    try {
      const locations = dto.map((location: LocationDto) => {
        const { name, countryId, isCommon } = location;
        return {
          name,
          isCommon,
          countryId,
        };
      });

      return await this.prismaService.location.createMany({
        data: locations,
        skipDuplicates: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: number) {
    try {
      return await this.prismaService.location.findUniqueOrThrow({
        where: { id },
        include: {
          country: true,
          cities: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll({
    skip,
    take,
    sortBy,
    search,
  }: FilterParamsDto): Promise<PaginationResult<Location>> {
    const queryWhere: Prisma.LocationWhereInput = {
      // will search through cities and countries as name can be either of the two
      // name: { contains: search, mode: 'insensitive' },

      name: { startsWith: search, mode: 'insensitive' },
    };
    const queryInclude: Prisma.LocationInclude = {
      country: true,
      // ! do not retrieve cities as it can drastically increase response size
      // * it's important to get data enough to show city and a country, or just a country
      // cities: true,
    };
    const queryOrderBy: Prisma.Enumerable<Prisma.LocationOrderByWithRelationInput> =
      (sortBy as any) || { name: 'asc' };

    try {
      const res = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.location,
        {
          where: queryWhere,
          skip,
          take,
          include: queryInclude,
          orderBy: queryOrderBy,
        },
        false,
      )();

      return res;
    } catch (error) {
      throw error;
    }
  }
}
