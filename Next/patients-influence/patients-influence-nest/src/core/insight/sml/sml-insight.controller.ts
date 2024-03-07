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
import { SMLInsightService } from './sml-insight.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GraphParamsDto, NPointGraphParamsDto } from '../dto/graph-params.dto';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { GraphResultEntity } from '../entities/graph-result.entity';
import { SMLFilterParamsDto } from './dto/filter-params.dto';
import { SmlPostsFilterDto } from 'src/core/sml/dto';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { PaginationParamsDto } from 'src/utils/object-definitions/dtos/pagination-params.dto';
import { SMLMostMentionedWordsParamsDto } from './dto/most-mentioned-words-params.dto';
import { SMLGraphParamsDto } from './dto/sml-graph-params.dto';
import { SMLMostMentionedBrandsParamsDto } from './dto/most-mentioned-brands-params.dto';
import { SMLMostMentionedProductsParamsDto } from './dto/most-mentioned-products-params.dto';
import { SMLMostMentionedSymptomsParamsDto } from './dto/most-mentioned-symptoms-params.dto';
import { SMLMostMentionedStrugglesParamsDto } from './dto/most-mentioned-struggles-params.dto';
import { SMLMostUsedWordsWithBrandsParamsDto } from './dto/most-used-words-with-brands-params.dto';
import { SMLMostUsedWordsWithProductsParamsDto } from './dto/most-used-words-with-products-params.dto';
import { SMLMostUsedWordsWithSymptomsParamsDto } from './dto/most-used-words-with-symtoms-params.dto';
import { SMLMostUsedWordsWithStrugglesParamsDto } from './dto/most-used-words-with-struggles-params.dto';

@Controller('insight/sml')
@ApiTags('insight', 'sml')
export class SMLInsightController {
  constructor(private readonly smlService: SMLInsightService) {}

  @Get('smlOverTimeData')
  @CheckAbilities({ action: Action.Manage, subject: 'SML' })
  @ApiOperation({
    summary: 'Return a number of SML (graph data)',
    description:
      'Retrieves a number of SML through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async smlOverTimeData(
    @Query() graphParams: GraphParamsDto,
    @Query() smlFilterParamsDto: SMLFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.smlService.getSMLCountData(graphParams, smlFilterParamsDto),
    );
  }

  @Get('smlRevenueOverTimeData')
  @CheckAbilities({ action: Action.Manage, subject: 'SML' })
  @ApiOperation({
    summary: 'Return a revenue from SML (graph data)',
    description:
      'Retrieves a revenue from SML through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async smlRevenueOverTimeData(@Query() graphParams: GraphParamsDto) {
    return new GraphResultEntity(
      await this.smlService.getSMLRevenueData(graphParams),
    );
  }

  //#region MOST MENTIONED X
  @Get('mostMentionedWords/:smlId')
  @CheckAbilities({ action: Action.Manage, subject: 'SML' })
  @ApiOperation({
    summary: 'Return the most mentioned words (graph data)',
    description:
      'Retrieves the most mentioned words through time within given time period.',
  })
  /* @ApiOkResponse({
    type: GraphResultEntity,
  }) */
  async mostMentionedWords(
    @Param('smlId') smlId: number,
    @Query() graphParams: SMLGraphParamsDto,
    @Query() filter: SMLMostMentionedWordsParamsDto,
  ) {
    return await this.smlService.mostMentionedWords(smlId, graphParams, filter);
  }

  @Get('mostMentionedBrands/:smlId')
  @CheckAbilities({ action: Action.Manage, subject: 'SML' })
  @ApiOperation({
    summary: 'Return the most mentioned brands (graph data)',
    description:
      'Retrieves the most mentioned brands through time within given time period.',
  })
  /* @ApiOkResponse({
    type: GraphResultEntity,
  }) */
  async mostMentionedBrands(
    @Param('smlId') smlId: number,
    @Query() graphParams: SMLGraphParamsDto,
    @Query() filter: SMLMostMentionedBrandsParamsDto,
  ) {
    return await this.smlService.mostMentionedBrands(
      smlId,
      graphParams,
      filter,
    );
  }

  @Get('mostMentionedProducts/:smlId')
  @CheckAbilities({ action: Action.Manage, subject: 'SML' })
  @ApiOperation({
    summary: 'Return the most mentioned products (graph data)',
    description:
      'Retrieves the most mentioned products through time within given time period.',
  })
  /* @ApiOkResponse({
    type: GraphResultEntity,
  }) */
  async mostMentionedProducts(
    @Param('smlId') smlId: number,
    @Query() graphParams: SMLGraphParamsDto,
    @Query() filter: SMLMostMentionedProductsParamsDto,
  ) {
    return await this.smlService.mostMentionedProducts(
      smlId,
      graphParams,
      filter,
    );
  }

  @Get('mostMentionedSymptoms/:smlId')
  @CheckAbilities({ action: Action.Manage, subject: 'SML' })
  @ApiOperation({
    summary: 'Return the most mentioned symptoms (graph data)',
    description:
      'Retrieves the most mentioned symptoms through time within given time period.',
  })
  /* @ApiOkResponse({
    type: GraphResultEntity,
  }) */
  async mostMentionedSymptoms(
    @Param('smlId') smlId: number,
    @Query() graphParams: SMLGraphParamsDto,
    @Query() filter: SMLMostMentionedSymptomsParamsDto,
  ) {
    return await this.smlService.mostMentionedSymptoms(
      smlId,
      graphParams,
      filter,
    );
  }

  @Get('mostMentionedStruggles/:smlId')
  @CheckAbilities({ action: Action.Manage, subject: 'SML' })
  @ApiOperation({
    summary: 'Return the most mentioned struggles (graph data)',
    description:
      'Retrieves the most mentioned struggles through time within given time period.',
  })
  /* @ApiOkResponse({
    type: GraphResultEntity,
  }) */
  async mostMentionedStruggles(
    @Param('smlId') smlId: number,
    @Query() graphParams: SMLGraphParamsDto,
    @Query() filter: SMLMostMentionedStrugglesParamsDto,
  ) {
    return await this.smlService.mostMentionedStruggles(
      smlId,
      graphParams,
      filter,
    );
  }
  //#endregion

  //#region MOST USED X WITH Y
  @Get('mostUsedWordsWithBrands/:smlId')
  @CheckAbilities({ action: Action.Manage, subject: 'SML' })
  @ApiOperation({
    summary: 'Return the most used words with brands (graph data)',
    description:
      'Retrieves the most used words with brands through time within given time period.',
  })
  /* @ApiOkResponse({
    type: GraphResultEntity,
  }) */
  async mostUsedWordsWithBrands(
    @Param('smlId') smlId: number,
    @Query() graphParams: SMLGraphParamsDto,
    @Query() filter: SMLMostUsedWordsWithBrandsParamsDto,
  ) {
    return await this.smlService.mostUsedWordsWithBrands(
      smlId,
      graphParams,
      filter,
    );
  }

  @Get('mostUsedWordsWithProducts/:smlId')
  @CheckAbilities({ action: Action.Manage, subject: 'SML' })
  @ApiOperation({
    summary: 'Return the most used words with products (graph data)',
    description:
      'Retrieves the most used words with products through time within given time period.',
  })
  /* @ApiOkResponse({
    type: GraphResultEntity,
  }) */
  async mostUsedWordsWithProducts(
    @Param('smlId') smlId: number,
    @Query() graphParams: SMLGraphParamsDto,
    @Query() filter: SMLMostUsedWordsWithProductsParamsDto,
  ) {
    return await this.smlService.mostUsedWordsWithProducts(
      smlId,
      graphParams,
      filter,
    );
  }

  @Get('mostUsedWordsWithSymptoms/:smlId')
  @CheckAbilities({ action: Action.Manage, subject: 'SML' })
  @ApiOperation({
    summary: 'Return the most used words with symptoms (graph data)',
    description:
      'Retrieves the most used words with symptoms through time within given time period.',
  })
  /* @ApiOkResponse({
    type: GraphResultEntity,
  }) */
  async mostUsedWordsWithSymptoms(
    @Param('smlId') smlId: number,
    @Query() graphParams: SMLGraphParamsDto,
    @Query() filter: SMLMostUsedWordsWithSymptomsParamsDto,
  ) {
    return await this.smlService.mostUsedWordsWithSymtoms(
      smlId,
      graphParams,
      filter,
    );
  }

  @Get('mostUsedWordsWithStruggles/:smlId')
  @CheckAbilities({ action: Action.Manage, subject: 'SML' })
  @ApiOperation({
    summary: 'Return the most used words with struggles (graph data)',
    description:
      'Retrieves the most used words with struggles through time within given time period.',
  })
  /* @ApiOkResponse({
    type: GraphResultEntity,
  }) */
  async mostUsedWordsWithStruggles(
    @Param('smlId') smlId: number,
    @Query() graphParams: SMLGraphParamsDto,
    @Query() filter: SMLMostUsedWordsWithStrugglesParamsDto,
  ) {
    return await this.smlService.mostUsedWordsWithStruggles(
      smlId,
      graphParams,
      filter,
    );
  }
  //#endregion
}
