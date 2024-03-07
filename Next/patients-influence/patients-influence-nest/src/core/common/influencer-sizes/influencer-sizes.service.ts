import { Injectable } from '@nestjs/common';
import { CreateInfluencerSizeDto } from './dto/create-influencer-size.dto';
import { UpdateInfluencerSizeDto } from './dto/update-influencer-size.dto';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { Prisma } from '@prisma/client';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';

@Injectable()
export class InfluencerSizesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createInfluencerSizeDto: CreateInfluencerSizeDto) {
    return 'This action adds a new influencerSize';
  }

  async findAll({ skip, take, sortBy, search }: FilterParamsDto) {
    const queryWhere: Prisma.InfluencersSizeWhereInput = {
      name: { contains: search, mode: 'insensitive' },
    };
    const queryOrderBy: Prisma.Enumerable<Prisma.InfluencersSizeOrderByWithRelationInput> =
      (sortBy as any) || { from: 'asc' };

    const response = await filterRecordsFactory(
      this.prismaService,
      (tx) => tx.influencersSize,
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
    return `This action returns a #${id} influencerSize`;
  }

  update(id: number, updateInfluencerSizeDto: UpdateInfluencerSizeDto) {
    return `This action updates a #${id} influencerSize`;
  }

  remove(id: number) {
    return `This action removes a #${id} influencerSize`;
  }
}
