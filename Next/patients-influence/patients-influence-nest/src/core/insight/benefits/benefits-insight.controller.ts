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
import { BenefitsInsightService } from './benefits-insight.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GraphParamsDto } from '../dto/graph-params.dto';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { GraphResultEntity } from '../entities/graph-result.entity';
import { BenefitFilterParamsDto } from './dto/filter-params.dto';

@Controller('insight/benefits')
@ApiTags('insight', 'benefits')
export class BenefitsInsightController {
  constructor(private readonly benefitsService: BenefitsInsightService) {}

  @Get('benefitsOverTimeData')
  // @CheckAbilities({ action: Action.Manage, subject: 'Benefit' })
  @ApiOperation({
    summary: 'Return a number of benefits (graph data)',
    description:
      'Retrieves a number of benefits through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async benefitsOverTimeData(
    @Query() graphParams: GraphParamsDto,
    @Query() benefitFilterParamsDto: BenefitFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.benefitsService.getBenefitsCountData(
        graphParams,
        benefitFilterParamsDto,
      ),
    );
  }
}
