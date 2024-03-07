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
import { SurveysInsightService } from './surveys-insight.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GraphParamsDto } from '../dto/graph-params.dto';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { GraphResultEntity } from '../entities/graph-result.entity';
import { SurveyFilterParamsDto } from './dto/filter-params.dto';

@Controller('insight/surveys')
@ApiTags('insight', 'surveys')
export class SurveysInsightController {
  constructor(private readonly surveysService: SurveysInsightService) {}

  @Get('surveysOverTimeData')
  @ApiOperation({
    summary: 'Return a number of surveys (graph data)',
    description:
      'Retrieves a number of surveys through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async surveysOverTimeData(
    @Query() graphParams: GraphParamsDto,
    @Query() surveyFilterParamsDto: SurveyFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.surveysService.getSurveysCountData(
        graphParams,
        surveyFilterParamsDto,
      ),
    );
  }

  @Get('surveysRevenueOverTimeData')
  @CheckAbilities({ action: Action.Manage, subject: 'Survey' })
  @ApiOperation({
    summary: 'Return a revenue from surveys (graph data)',
    description:
      'Retrieves a revenue from surveys through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async surveysRevenueOverTimeData(@Query() graphParams: GraphParamsDto) {
    return new GraphResultEntity(
      await this.surveysService.getSurveysRevenueData(graphParams),
    );
  }
}
