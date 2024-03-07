import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Put,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { InfluencerCampaignAmount } from '@prisma/client';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { CampaignDesiredIncomeService } from './campaign-desired-income.service';
import { UpsertCampaignDesiredIncomeDto } from './dto/upsert-campaign-desired-income.dto';
import { CampaignDesiredIncomeEntity } from './entities/campaign-desired-income.entity';
import { serializeArray } from 'src/utils/serializers/array.serializer';
import { Response } from 'express';
import { PostType } from './enums/post-type.enum';
import { serializeEnum } from 'src/utils/serializers/enum-result.serializer';
import { EnumItemResult } from 'src/utils/object-definitions/results/enum-item-result';

@Controller('influencer/:userId/desiredIncome/campaign')
@ApiTags('influencer')
export class CampaignDesiredIncomeController {
  constructor(
    private readonly campaignDesiredIncomeService: CampaignDesiredIncomeService,
  ) {}

  @Get('postTypes')
  // ? @CheckAbilities({ action: Action.Read, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Get post types',
    description:
      'Retrieves available campaign post types (post type enum/property).',
  })
  @ApiOkResponse({ type: EnumItemResult, isArray: true })
  @ApiTags('enums and types')
  @NoAutoSerialize()
  getAvailablePostTypes(@Res() res: Response) {
    return res.json(serializeEnum(PostType));
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Retrieve campaign desired income',
    description: 'Retrieves desired income for each type of a campaign post.',
  })
  @ApiOkResponse({ type: CampaignDesiredIncomeEntity, isArray: true })
  @NoAutoSerialize()
  get(@Param('userId', ParseIntPipe) userId: number) {
    return serializeArray<
      InfluencerCampaignAmount,
      CampaignDesiredIncomeEntity
    >(
      this.campaignDesiredIncomeService.get(userId),
      CampaignDesiredIncomeEntity,
    );
  }

  @Put()
  @CheckAbilities({ action: Action.Update, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Update/Create campaign desired income',
    description:
      'Updates or creates campaign desired income for any type of a campaign post. If none exists by given ID, new is created for the influencer. If it exists by given ID, updates a whole resource.',
  })
  @ApiBody({ type: UpsertCampaignDesiredIncomeDto, isArray: true })
  @ApiOkResponse({ type: CampaignDesiredIncomeEntity, isArray: true })
  @NoAutoSerialize()
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body(new ParseArrayPipe({ items: UpsertCampaignDesiredIncomeDto }))
    upsertCampaignDesiredIncomeDto: UpsertCampaignDesiredIncomeDto[],
  ) {
    return serializeArray<
      InfluencerCampaignAmount,
      CampaignDesiredIncomeEntity
    >(
      this.campaignDesiredIncomeService.upsert(
        userId,
        upsertCampaignDesiredIncomeDto,
      ),
      CampaignDesiredIncomeEntity,
    );
  }
}
