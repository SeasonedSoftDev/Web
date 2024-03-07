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
import { CreateUserCommentDto } from './dto/create-user-comment.dto';
import { User, UserComment } from '@prisma/client';
import { UserCommentEntity } from './entities/user-comment.entity';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { UserCommentPaginationResult } from './utils/user-comment-pagination-result';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';

@Controller('users/:userId/comment')
@ApiTags('users')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'UserComment' })
  @ApiOperation({
    summary: 'Add a new comment/note on a user',
    description:
      'Adds a new comment/note on a user, so other you or other admins can keep track of the user.',
  })
  @ApiCreatedResponse({ type: UserCommentEntity })
  create(
    @Req() req: Request,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() commentDto: CreateUserCommentDto,
  ) {
    return this.commentService.create(userId, commentDto, req.user as User);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'UserComment' })
  @ApiOperation({
    summary: "Retrieve user's comments/notes",
    description:
      "Retrieves user's comments together with its authors. Default sort is by `createdAt` property in a descending order.",
  })
  @ApiOkResponse({ type: UserCommentPaginationResult })
  @NoAutoSerialize()
  filter(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationParamsDto: FilterParamsDto,
  ) {
    return serializePaginationResult<UserComment, UserCommentEntity>(
      this.commentService.filter(userId, paginationParamsDto),
      UserCommentEntity,
    );
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: 'UserComment' })
  @ApiOperation({
    summary: "Delete user's comment/note",
    description: "Deletes user's comment/note permanently.",
  })
  @ApiNoContentResponse({
    description: 'Comment deleted from the user',
    type: UserCommentEntity,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.delete(id);
  }
}
