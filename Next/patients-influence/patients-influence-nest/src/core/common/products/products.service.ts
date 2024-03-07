import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { Prisma, User } from '@prisma/client';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { UserEntity } from 'src/core/users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    user: UserEntity,
    tx?: Omit<
      PrismaService,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
  ) {
    const { name } = createProductDto;
    return await (tx || this.prismaService).product.create({
      data: { name, createdByClientId: user.client?.id },
    });
  }

  async findAll({ skip, take, sortBy, search }: FilterParamsDto, user: User) {
    const queryWhere: Prisma.ProductWhereInput = {
      name: { contains: search, mode: 'insensitive' },
    };
    const queryOrderBy: Prisma.Enumerable<Prisma.ProductOrderByWithRelationInput> =
      (sortBy as any) || { name: 'asc' };

    const response = await filterRecordsFactory(
      this.prismaService,
      (tx) => tx.product,
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
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
