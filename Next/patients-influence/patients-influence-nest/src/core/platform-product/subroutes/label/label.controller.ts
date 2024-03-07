import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { LabelService } from './label.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { User } from '@prisma/client';
import { AuthUser } from 'src/core/auth/decorators';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { ProductOrderLabelPaginationEntity } from './entities/product-order-label-pagination.entity';
import { BatchPayloadEntity } from 'src/utils/entities/batch-payload.entity';

@Controller('platformProduct/:orderId/label')
@ApiTags('platform product order')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'PlatformProductLabel' })
  @ApiOperation({
    summary: 'Get product order label/s (filter)',
    description:
      'Retrieves product order label/s by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    description: 'Product order label/s retrieved',
    type: ProductOrderLabelPaginationEntity,
  })
  @NoAutoSerialize()
  findMany(
    @Query() filterParamsDto: FilterParamsDto,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    /* return serializePaginationResult(
      this.labelService.filter(userId, filterParamsDto),
      UserLabelEntity,
    ); */
    // TODO fix missing properties when using serializer!
    return this.labelService.filter(orderId, filterParamsDto);
  }

  @Patch()
  @CheckAbilities({ action: Action.Manage, subject: 'PlatformProductLabel' })
  @ApiOperation({
    summary: 'Update labels on a product order',
    description:
      'Updates a labels on a product order, so other you or other admins can keep track of the product order.' +
      '\n\nA new list of labels swaps the old list.',
  })
  @ApiBody({
    description: 'Label IDs',
    type: Number,
    isArray: true,
  })
  @ApiOkResponse({
    description: 'Product order labels updated',
    type: BatchPayloadEntity,
  })
  update(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() ids: number[],
    @AuthUser() user: User,
  ) {
    return this.labelService.update(orderId, ids, user);
  }
}
