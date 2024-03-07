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
import { CampaignsInsightService } from './campaigns-insight.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GraphParamsDto } from '../dto/graph-params.dto';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { GraphResultEntity } from '../entities/graph-result.entity';
import { CampaignFilterParamsDto } from './dto/filter-params.dto';

@Controller('insight/campaigns')
@ApiTags('insight', 'campaign')
export class CampaignsInsightController {
  constructor(private readonly campaignsService: CampaignsInsightService) {}

  @Get('campaignsOverTimeData')
  @CheckAbilities({ action: Action.Read, subject: 'Campaign' })
  @ApiOperation({
    summary: 'Return a number of campaigns (graph data)',
    description:
      'Retrieves a number of campaigns through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async campaignsOverTimeData(
    @Query() graphParams: GraphParamsDto,
    @Query() campaignFilterParamsDto: CampaignFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.campaignsService.getCampaignsCountData(
        graphParams,
        campaignFilterParamsDto,
      ),
    );
  }

  @Get('campaignsRevenueOverTimeData')
  @CheckAbilities({ action: Action.Read, subject: 'Campaign' })
  @ApiOperation({
    summary: 'Return a revenue from campaigns (graph data)',
    description:
      'Retrieves a revenue from campaigns through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async campaignsRevenueOverTimeData(@Query() graphParams: GraphParamsDto) {
    return new GraphResultEntity(
      await this.campaignsService.getCampaignsRevenueData(graphParams),
    );
  }
}
