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
import { InsightService } from './insight.service';
// import { InfluencersService } from './influencers/influencers-insight.service';
import { TimeInterval } from './enums/time-interval.enum';
import { GraphPeriod } from './enums/graph-period.enum';
import { GraphType } from './enums/graph-type.enum';

@Controller('insight')
export class InsightController {
  constructor(
    private readonly insightService: InsightService, // private readonly influencersService: InfluencersService,
  ) {}

  /* @Get('graph')
  async getGraph(@Query('interval') interval: TimeInterval) {
    return this.influencersService.getGraph(interval);
  } */

  /* @Get('graph')
  async getGraph(@Query('graphPeriod') graphPeriod: GraphPeriod, @Query('max') max?: number) {
    return this.influencersService.getGraph(graphPeriod, max);
  }

  @Get('graph2')
  async getGraph2(
    @Query('graphPeriod') graphPeriod: GraphPeriod,
    @Query('graphType') graphType: GraphType,
    @Query('max') max?: number,
  ) {
    return this.influencersService.getCountData(graphPeriod, max, graphType);
  }

  @Get('countNewInfluencers')
  countNewInfluencers() {
    return this.influencersService.countNewInfluencers();
  }

  @Get('countInfluencersBySocialPlatform')
  countInfluencersBySocialPlatform() {
    return this.influencersService.countInfluencersBySocialPlatform();
  }

  @Get('countDiscoveredClients')
  countDiscoveredClients() {
    return this.influencersService.countDiscoveredClients();
  } */
}
