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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GraphParamsDto } from '../dto/graph-params.dto';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { GraphResultEntity } from '../entities/graph-result.entity';
import { FinanceInsightService } from './finance-insight.service';

@Controller('insight/finance')
@ApiTags('insight', 'finance')
export class FinanceInsightController {
  constructor(private readonly financeService: FinanceInsightService) {}

  @Get('financeRevenueOverTimeData')
  @CheckAbilities({ action: Action.Manage, subject: 'PlatformProductOrder' })
  @ApiOperation({
    summary: 'Return a revenue from all products (graph data)',
    description:
      'Retrieves a revenue from all products through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async financeRevenueOverTimeData(@Query() graphParams: GraphParamsDto) {
    return new GraphResultEntity(
      await this.financeService.getFinanceRevenueData(graphParams),
    );
  }

  @Get('financeCostOverTimeData')
  @CheckAbilities({ action: Action.Manage, subject: 'PlatformProductOrder' })
  @ApiOperation({
    summary: 'Return a cost from all products (graph data)',
    description:
      'Retrieves a cost from all products through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async financeCostOverTimeData(@Query() graphParams: GraphParamsDto) {
    return new GraphResultEntity(
      await this.financeService.getFinanceCostData(graphParams),
    );
  }

  @Get('financeProfitOverTimeData')
  @CheckAbilities({ action: Action.Manage, subject: 'PlatformProductOrder' })
  @ApiOperation({
    summary: 'Return a profit from all products (graph data)',
    description:
      'Retrieves a profit from all products through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async financeProfitOverTimeData(@Query() graphParams: GraphParamsDto) {
    return new GraphResultEntity(
      await this.financeService.getFinanceProfitData(graphParams),
    );
  }

  @Get('financeMarginOverTimeData')
  @CheckAbilities({ action: Action.Manage, subject: 'PlatformProductOrder' })
  @ApiOperation({
    summary: 'Return a margin from all products (graph data)',
    description:
      'Retrieves a margin from all products through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async financeMarginOverTimeData(@Query() graphParams: GraphParamsDto) {
    return new GraphResultEntity(
      await this.financeService.getFinanceMarginData(graphParams),
    );
  }
}
