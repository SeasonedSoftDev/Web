import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AmbassadorsInsightService } from './ambassadors-insight.service';
import { GraphParamsDto } from '../dto/graph-params.dto';
import { GraphResultEntity } from '../entities/graph-result.entity';
import { ClientProductFilterParamsDto } from '../clients/dto/client-product-filter-params.dto';

@Controller('insight/ambassadors')
@ApiTags('insight', 'ambassadors')
export class AmbassadorsInsightController {
  constructor(private readonly ambassadorService: AmbassadorsInsightService) {}

  @Get('clientsOverTimeData/:userId')
  @ApiOperation({
    summary:
      'Return a number  of all clients invited by the ambassador that ordered a campaign (graph data)',
    description:
      'Retrieves a number of all clients invited by the ambassador that ordered a campaign through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async clientsCountData(
    @Param('userId') id: number,
    @Query() graphParams: GraphParamsDto,
    @Query() campaignFilterParamsDto: ClientProductFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.ambassadorService.getClientsCountData(
        id,
        graphParams,
        campaignFilterParamsDto,
      ),
    );
  }

  @Get('clientsProductsOverTimeData/:userId')
  @ApiOperation({
    summary:
      'Return a number  of all clients invited by the ambassador that ordered a campaign (graph data)',
    description:
      'Retrieves a number of all clients invited by the ambassador that ordered a campaign through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async clientsProductsCountData(
    @Param('userId') id: number,
    @Query() graphParams: GraphParamsDto,
    @Query() campaignFilterParamsDto: ClientProductFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.ambassadorService.getClientsProductsCountData(
        id,
        graphParams,
        campaignFilterParamsDto,
      ),
    );
  }

  @Get('clientsProfitOverTimeData/:userId')
  @ApiOperation({
    summary:
      'Return a number  of all clients invited by the ambassador that ordered a campaign (graph data)',
    description:
      'Retrieves a number of all clients invited by the ambassador that ordered a campaign through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async clientsProfitCountData(
    @Param('userId') id: number,
    @Query() graphParams: GraphParamsDto,
    @Query() campaignFilterParamsDto: ClientProductFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.ambassadorService.getClientsProfitCountData(
        id,
        graphParams,
        campaignFilterParamsDto,
      ),
    );
  }
}
