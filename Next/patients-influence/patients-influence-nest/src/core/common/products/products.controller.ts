import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// import { Throttle } from '@nestjs/throttler';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { ProductEntity } from './entities/product.entity';
import { ProductPaginationEntity } from './entities/product-pagination.entity';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { AuthUser } from 'src/core/auth/decorators';
import { UserEntity } from 'src/core/users/entities/user.entity';
import { User } from '@prisma/client';

@Controller('products')
@ApiTags('product', 'dropdown options')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @CheckAbilities({ subject: 'Product', action: Action.Create })
  async create(
    @Body() createProductDto: CreateProductDto,
    @AuthUser() user: UserEntity,
  ) {
    return new ProductEntity(
      await this.productsService.create(createProductDto, user),
    );
  }

  @Get()
  // @Throttle(50, 60)
  // @Throttle(100, 60)
  @ApiOperation({
    summary: 'Get product/s (filter)',
    description:
      'Retrieves the product/s by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    type: ProductPaginationEntity,
  })
  findAll(@Query() filterParamsDto: FilterParamsDto, @AuthUser() user: User) {
    return serializePaginationResult(
      this.productsService.findAll(filterParamsDto, user),
      ProductEntity,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
