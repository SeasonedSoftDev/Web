import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { CreateProductOrderCommentDto } from './dto/create-product-order-comment.dto';
import { PlatformProductOrderComment, User } from '@prisma/client';
import { ProductOrderCommentEntity } from './entities/product-order-comment.entity';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { ProductOrderCommentPaginationResult } from './utils/product-order-comment-pagination-result';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';

@Controller('platformProduct/:orderId/comment')
@ApiTags('platform product order')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'PlatformProductComment' })
  @ApiOperation({
    summary: 'Add a new comment/note on a product order',
    description:
      'Adds a new comment/note on a product order, so other you or other admins can keep track of the product order.',
  })
  @ApiCreatedResponse({ type: ProductOrderCommentEntity })
  create(
    @Req() req: Request,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() commentDto: CreateProductOrderCommentDto,
  ) {
    return this.commentService.create(orderId, commentDto, req.user as User);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'PlatformProductComment' })
  @ApiOperation({
    summary: "Retrieve product order's comments/notes",
    description:
      "Retrieves product order's comments together with its authors. Default sort is by `createdAt` property in a descending order.",
  })
  @ApiOkResponse({ type: ProductOrderCommentPaginationResult })
  @NoAutoSerialize()
  filter(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Query() paginationParamsDto: FilterParamsDto,
  ) {
    return serializePaginationResult<
      PlatformProductOrderComment,
      ProductOrderCommentEntity
    >(
      this.commentService.filter(orderId, paginationParamsDto),
      ProductOrderCommentEntity,
    );
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: 'PlatformProductComment' })
  @ApiOperation({
    summary: "Delete product order's comment/note",
    description: "Deletes product order's comment/note permanently.",
  })
  @ApiNoContentResponse({
    description: 'Comment deleted from the product order',
    type: ProductOrderCommentEntity,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.delete(id);
  }
}
