import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LabelsService } from './labels.service';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { LabelFilterParamsDto } from './dto/query/label-filter-params.dto';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { LabelEntity } from './entities/label.entity';
import { BatchPayloadEntity } from 'src/utils/entities/batch-payload.entity';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { LabelPaginationEntity } from './entities/label-pagination.entity';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { EnumItemResult } from 'src/utils/object-definitions/results/enum-item-result';
import { AssigneeType } from './enums/asignee-type.enum';
import { serializeEnum } from 'src/utils/serializers/enum-result.serializer';
import { Response } from 'express';
// import { Throttle } from '@nestjs/throttler';

@Controller('labels')
@ApiTags('labels', 'dropdown options')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Get('assigneeTypes')
  // ? @CheckAbilities({ action: Action.Read, subject: 'Label' })
  @ApiOperation({
    summary: 'Get assignee types',
    description:
      'Retrieves available assignee types (assignee type enum/property). It is used to group certain labels from each other, eg. user labels from platform-related labels.',
  })
  @ApiOkResponse({ type: EnumItemResult, isArray: true })
  @ApiTags('enums and types')
  @NoAutoSerialize()
  getAvailableSurveyTypes(@Res() res: Response) {
    return res.json(serializeEnum(AssigneeType));
  }

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'Label' })
  @ApiOperation({
    summary: 'Create label/s',
  })
  @ApiBody({ type: CreateLabelDto, isArray: true })
  @ApiCreatedResponse({
    description: 'Label/s created',
    type: BatchPayloadEntity,
  })
  createMany(@Body() dto: CreateLabelDto[]) {
    return this.labelsService.createMany(dto);
  }

  @Get(':name')
  // @Throttle(50, 60)
  // @Throttle(100, 60)
  @CheckAbilities({ action: Action.Read, subject: 'Label' })
  @ApiOperation({
    summary: 'Get single label',
    description: 'Retrieves a single label and is case-insensitive.',
  })
  @ApiOkResponse({
    description: 'Label retrieved',
    type: LabelEntity,
  })
  async findOneByName(@Param('name') name: string) {
    return new LabelEntity(await this.labelsService.findOneByName(name));
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: 'Label' })
  @ApiOperation({
    summary: 'Get single label',
  })
  @ApiOkResponse({
    description: 'Label retrieved',
    type: LabelEntity,
  })
  async findOneById(@Param('id') id: number) {
    return new LabelEntity(await this.labelsService.findOneById(id));
  }

  @Get()
  // @Throttle(50, 60)
  // @Throttle(100, 60)
  @CheckAbilities({ action: Action.Read, subject: 'Label' })
  @ApiOperation({
    summary: 'Get label/s (filter)',
    description:
      'Retrieves label/s by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    description: 'Label/s retrieved',
    type: LabelPaginationEntity,
  })
  @NoAutoSerialize()
  findMany(
    @Query() filterParamsDto: FilterParamsDto,
    @Query() labelFilterParamsDto: LabelFilterParamsDto,
  ) {
    return serializePaginationResult(
      this.labelsService.findMany(filterParamsDto, labelFilterParamsDto),
      LabelEntity,
    );
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: 'Label' })
  @ApiOperation({
    summary: 'Delete single label',
  })
  @ApiOkResponse({
    description: 'Label deleted',
    type: LabelEntity,
  })
  async deleteOne(@Param('id') id: number) {
    return new LabelEntity(await this.labelsService.deleteOne(id));
  }

  @Delete()
  @CheckAbilities({ action: Action.Delete, subject: 'Label' })
  @ApiOperation({
    summary: 'Delete multiple labels',
  })
  @ApiBody({
    description: 'Label IDs',
    type: Number,
    isArray: true,
  })
  @ApiOkResponse({
    description: 'Label/s deleted',
    type: BatchPayloadEntity,
  })
  deleteMany(@Body() ids: number[]) {
    return this.labelsService.deleteMany(ids);
  }
}
