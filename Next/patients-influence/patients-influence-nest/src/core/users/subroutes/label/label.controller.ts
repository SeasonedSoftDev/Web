import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  Query,
} from '@nestjs/common';
import { LabelService } from './label.service';
import { CreateLabelDto } from './dto/create-user-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { User } from '@prisma/client';
import { AuthUser } from 'src/core/auth/decorators';
import { UserLabelEntity } from './entities/user-label.entity';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { UserLabelPaginationEntity } from './entities/user-label-pagination.entity';
import { BatchPayloadEntity } from 'src/utils/entities/batch-payload.entity';

@Controller('users/:userId/label')
@ApiTags('users')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'UserLabel' })
  @ApiOperation({
    summary: 'Get user label/s (filter)',
    description:
      'Retrieves user label/s by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    description: 'User label/s retrieved',
    type: UserLabelPaginationEntity,
  })
  @NoAutoSerialize()
  findMany(
    @Query() filterParamsDto: FilterParamsDto,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    /* return serializePaginationResult(
      this.labelService.filter(userId, filterParamsDto),
      UserLabelEntity,
    ); */
    // TODO fix missing properties when using serializer!
    return this.labelService.filter(userId, filterParamsDto);
  }

  @Patch()
  @CheckAbilities({ action: Action.Manage, subject: 'UserLabel' })
  @ApiOperation({
    summary: 'Update labels on a user',
    description:
      'Updates a labels on a user, so other you or other admins can keep track of the user.' +
      '\n\nA new list of labels swaps the old list.',
  })
  @ApiBody({
    description: 'Label IDs',
    type: Number,
    isArray: true,
  })
  @ApiOkResponse({
    description: 'User labels updated',
    type: BatchPayloadEntity,
  })
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() ids: number[],
    @AuthUser() user: User,
  ) {
    return this.labelService.update(userId, ids, user);
  }
}
