import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Get,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { StakeholdersService } from './stakeholders.service';
import { CreateStakeholderDto } from './dto/create-stakeholder.dto';
import { UpdateStakeholderDto } from './dto/update-stakeholder.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser, Public } from '../auth/decorators';
import { UserEntity } from '../users/entities/user.entity';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';

import { InfluencerFilterDto } from './dto';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { Stakeholder } from '@prisma/client';
import { StakeholderEntity } from '../influencer/entities/stakeholder.entity';
import { CheckAbilities } from '../auth/ability/decorators/ability.decorator';
import { Action } from '../auth/ability';
import { StakeholderType } from 'src/utils/enums/stakeholder-type.enum';
import { serializeEnum } from 'src/utils/serializers/enum-result.serializer';
import { EnumItemResult } from 'src/utils/object-definitions/results/enum-item-result';
import { Response } from 'express';
import { InfluencerType } from '../influencer/enums/influencer-type.enum';
import { FindByIdsDto } from '../finance/dto/find-by-ids.dto';

@Controller('stakeholders')
@ApiTags('stakeholders')
export class StakeholdersController {
  constructor(private readonly stakeholdersService: StakeholdersService) {}

  @Get('stakeholderTypes')
  // ?
  /* @CheckAbilities(
    { action: Action.Read, subject: 'Stakeholder' },
    { action: Action.Read, subject: 'Influencer' },
  ) */
  @ApiOperation({
    summary: 'Get stakeholder types',
    description:
      'Retrieves available stakeholder types (assignee type enum/property).',
  })
  @ApiOkResponse({ type: EnumItemResult, isArray: true })
  @ApiTags('enums and types')
  @NoAutoSerialize()
  getAvailableSurveyTypes(
    @Res() res: Response,
    @Query() query?: { influencerType?: string },
  ) {
    if (query && query.influencerType === 'true') {
      return res.json(serializeEnum(InfluencerType));
    }
    return res.json(serializeEnum(StakeholderType));
  }

  @Post()
  @ApiOperation({
    summary: 'Create stakeholder',
    description: 'Creates a new stakeholder.',
  })
  @ApiOkResponse({ type: StakeholderEntity })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStakeholderDto: CreateStakeholderDto) {
    return this.stakeholdersService.create(createStakeholderDto);
  }

  @Post('getInfluencerStakeholders')
  @CheckAbilities({ action: Action.Manage, subject: 'Stakeholder' })
  @HttpCode(HttpStatus.OK)
  @NoAutoSerialize()
  findAllInfluencers(
    @Query() pagination: FilterParamsDto,
    @Body()
    dto: InfluencerFilterDto,
    @AuthUser() user: UserEntity,
  ) {
    return serializePaginationResult<Stakeholder, StakeholderEntity>(
      this.stakeholdersService.findAllInfluencerStakeholders(pagination, dto),
      StakeholderEntity,
    );
  }

  @Post('learnFollowers')
  async learnFollowers(@Body() dto: FindByIdsDto) {
    return this.stakeholdersService.learnFollowers(dto);
  }

  @Post('learnInfluencers')
  async learnInfluencers(@Body() dto: FindByIdsDto) {
    return this.stakeholdersService.learnInfluencers(dto);
  }

  @Public()
  @Post('/update')
  @ApiOperation({
    summary: 'Update stakeholder',
    description: 'Updates an existing stakeholder.',
  })
  @HttpCode(HttpStatus.OK)
  update(@Body() updateStakeholderDto: any) {
    return this.stakeholdersService.update(updateStakeholderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stakeholdersService.remove(+id);
  }
}
