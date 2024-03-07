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
import { ClientsInsightService } from './clients-insight.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GraphParamsDto } from '../dto/graph-params.dto';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { GraphResultEntity } from '../entities/graph-result.entity';
import { ClientFilterParamsDto } from './dto/client-filter-params.dto';
import { DiscoverClientFilterParamsDto } from './dto/discover-client-filter-params.dto';
import { ClientCampaignPerformanceFilterParamsDto } from './dto/campaign-performance-filter-params.dto';
import { UserGraphParamsDto } from '../dto/user-graph-params.dto';
import {
  ClientCampaignFilterParamsDto,
  ClientCampaignReportFilterParamsDto,
  ClientProductFilterParamsDto,
  ClientSMLFilterParamsDto,
  ClientSurveyFilterParamsDto,
} from './dto/client-product-filter-params.dto';
// import { cacheKeys } from 'src/config';
// import { CacheAndInvalidate } from 'src/decorators/cache-and-invalidate.decorator';
// import { milliseconds } from 'date-fns';
import {
  ClientCampaignInfluencerFilterParamsDto,
  ClientProductInfluencerFilterParamsDto,
  ClientSurveyInfluencerFilterParamsDto,
} from './dto/client-product-influencer-filter-params.dto';
import { PlatformProduct } from 'src/core/platform-product/enums/platform-product.enum';

@Controller('insight/clients')
@ApiTags('insight', 'client')
export class ClientsInsightController {
  constructor(private readonly clientsService: ClientsInsightService) {}

  @Get('clientsOverTimeData')
  @CheckAbilities({ action: Action.Read, subject: 'Client' })
  @ApiOperation({
    summary: 'Return a number of clients (graph data)',
    description:
      'Retrieves a number of clients through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  // @CacheAndInvalidate(milliseconds({ days: 1 }), cacheKeys.insightClients)
  async clientsOverTimeData(
    @Query() graphParams: GraphParamsDto,
    @Query() clientFilterParamsDto: ClientFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.clientsService.getClientsCountData(
        graphParams,
        clientFilterParamsDto,
      ),
    );
  }

  @Get('discoverClientsOverTimeData')
  @CheckAbilities(
    { action: Action.Read, subject: 'Client' },
    { action: Action.Read, subject: 'DiscoverClient' },
  )
  @ApiOperation({
    summary: 'Return a number of discover clients (graph data)',
    description:
      'Retrieves a number of discover clients through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  // @CacheAndInvalidate(
  //   milliseconds({ days: 1 }),
  //   cacheKeys.insightDiscoverClients,
  // )
  async discoverClientsOverTimeData(
    @Query() graphParams: GraphParamsDto,
    @Query() discoverClientFilterParamsDto: DiscoverClientFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.clientsService.getDiscoverClientsCountData(
        graphParams,
        discoverClientFilterParamsDto,
      ),
    );
  }

  @Get('clientProductsOverTimeData/:userId')
  // @CheckAbilities({ action: Action.Read, subject: 'Client' })
  @ApiOperation({
    summary: 'Return a number of client products (graph data)',
    description:
      'Retrieves a number of client products through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  // @CacheAndInvalidate(
  //   milliseconds({ days: 1 }),
  //   cacheKeys.insightClientProducts,
  // )
  async clientProductsOverTimeData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
    @Query()
    clientProductFilterParamsDto: ClientProductFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.clientsService.getClientProductsCountData(
        id,
        graphParams,
        clientProductFilterParamsDto,
      ),
    );
  }

  @Get('clientProductInfluencersOverTimeData/:userId')
  @CheckAbilities({ action: Action.Read, subject: 'Client' })
  @ApiOperation({
    summary: 'Return a number of client product influencers (graph data)',
    description:
      'Retrieves a number of client product influencers through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  // @CacheAndInvalidate(
  //   milliseconds({ days: 1 }),
  //   cacheKeys.insightClientProductInfluencers,
  // )
  async clientProductInfluencersOverTimeData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
    @Query()
    clientProductInfluencerFilterParamsDto: ClientProductInfluencerFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.clientsService.getClientProductInfluencersCountData(
        id,
        graphParams,
        clientProductInfluencerFilterParamsDto,
      ),
    );
  }

  //#region CLIENT PRODUCTS
  @Get('clientCampaignsOverTimeData/:userId')
  @CheckAbilities({ action: Action.Read, subject: 'Client' })
  @ApiOperation({
    summary: 'Return a number of client campaigns (graph data)',
    description:
      'Retrieves a number of client campaigns through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  // @CacheAndInvalidate(
  //   milliseconds({ days: 1 }),
  //   cacheKeys.insightClientCampaigns,
  // )
  async clientCampaignsOverTimeData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
    @Query()
    clientCampaignFilterParamsDto: ClientCampaignFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.clientsService.getClientProductsCountData(id, graphParams, {
        ...clientCampaignFilterParamsDto,
        product: PlatformProduct.Campaign,
      }),
    );
  }

  @Get('clientSurveysOverTimeData/:userId')
  @CheckAbilities({ action: Action.Read, subject: 'Client' })
  @ApiOperation({
    summary: 'Return a number of client surveys (graph data)',
    description:
      'Retrieves a number of client surveys through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  // @CacheAndInvalidate(milliseconds({ days: 1 }), cacheKeys.insightClientSurveys)
  async clientSurveysOverTimeData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
    @Query()
    clientSurveyFilterParamsDto: ClientSurveyFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.clientsService.getClientProductsCountData(id, graphParams, {
        ...clientSurveyFilterParamsDto,
        product: PlatformProduct.Survey,
      }),
    );
  }

  @Get('clientSMLsOverTimeData/:userId')
  @CheckAbilities({ action: Action.Read, subject: 'Client' })
  @ApiOperation({
    summary: 'Return a number of client smls (graph data)',
    description:
      'Retrieves a number of client smls through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  // @CacheAndInvalidate(milliseconds({ days: 1 }), cacheKeys.insightClientSMLs)
  async clientSMLsOverTimeData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
    @Query()
    clientSMLFilterParamsDto: ClientSMLFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.clientsService.getClientProductsCountData(id, graphParams, {
        ...clientSMLFilterParamsDto,
        product: PlatformProduct.SocialMediaListening,
      }),
    );
  }

  @Get('clientCampaignReportsOverTimeData/:userId')
  @CheckAbilities({ action: Action.Read, subject: 'Client' })
  @ApiOperation({
    summary: 'Return a number of client campaign reports (graph data)',
    description:
      'Retrieves a number of client campaign reports through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  // @CacheAndInvalidate(
  //   milliseconds({ days: 1 }),
  //   cacheKeys.insightClientCampaignReports,
  // )
  async clientCampaignReportsOverTimeData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
    @Query()
    clientCampaignReportFilterParamsDto: ClientCampaignReportFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.clientsService.getClientProductsCountData(id, graphParams, {
        ...clientCampaignReportFilterParamsDto,
        product: PlatformProduct.CampaignReport,
      }),
    );
  }
  //#endregion

  //#region CLIENT PRODUCT INFLUENCERS
  @Get('clientCampaignInfluencersOverTimeData/:userId')
  @CheckAbilities({ action: Action.Read, subject: 'Client' })
  @ApiOperation({
    summary: 'Return a number of client campaign influencers (graph data)',
    description:
      'Retrieves a number of client campaign influencers through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  // @CacheAndInvalidate(
  //   milliseconds({ days: 1 }),
  //   cacheKeys.insightClientCampaignInfluencers,
  // )
  async clientCampaignInfluencersOverTimeData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
    @Query()
    clientCampaignInfluencerFilterParamsDto: ClientCampaignInfluencerFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.clientsService.getClientProductInfluencersCountData(
        id,
        graphParams,
        {
          ...clientCampaignInfluencerFilterParamsDto,
          product: PlatformProduct.Campaign,
        },
      ),
    );
  }

  @Get('clientSurveyInfluencersOverTimeData/:userId')
  @CheckAbilities({ action: Action.Read, subject: 'Client' })
  @ApiOperation({
    summary: 'Return a number of client survey influencers (graph data)',
    description:
      'Retrieves a number of client survey influencers through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  // @CacheAndInvalidate(
  //   milliseconds({ days: 1 }),
  //   cacheKeys.insightClientSurveyInfluencers,
  // )
  async clientSurveyInfluencersOverTimeData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
    @Query()
    clientSurveyInfluencerFilterParamsDto: ClientSurveyInfluencerFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.clientsService.getClientProductInfluencersCountData(
        id,
        graphParams,
        {
          ...clientSurveyInfluencerFilterParamsDto,
          product: PlatformProduct.Survey,
        },
      ),
    );
  }
  //#endregion

  @Get('clientCampaignsPerformanceOverTimeData/:userId')
  @CheckAbilities({ action: Action.Read, subject: 'Client' })
  @ApiOperation({
    summary: "Return a number of client campaigns' performance (graph data)",
    description:
      "Retrieves a number of client campaigns' performance through time within given time period.",
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  // @CacheAndInvalidate(
  //   milliseconds({ days: 1 }),
  //   cacheKeys.insightClientCampaignPerformances,
  // )
  async clientCampaignsPerformanceOverTimeData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
    @Query()
    clientCampaignPerformanceFilterParamsDto: ClientCampaignPerformanceFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.clientsService.getClientCampaignsPerformanceData(
        id,
        graphParams,
        clientCampaignPerformanceFilterParamsDto,
      ),
    );
  }

  @Get('clientRecommendedOverTimeData/:userId')
  @CheckAbilities({ action: Action.Read, subject: 'Client' })
  @ApiOperation({
    summary: "Return a number of client campaigns' performance (graph data)",
    description:
      "Retrieves a number of client campaigns' performance through time within given time period.",
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  // @CacheAndInvalidate(
  //   milliseconds({ days: 1 }),
  //   cacheKeys.insightClientCampaignPerformances,
  // )
  async clientRecommendedOverTimeData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
  ) {
    return new GraphResultEntity(
      await this.clientsService.getClientRecommendedOverTimeData(
        id,
        graphParams,
      ),
    );
  }
}
