import { Controller, Get, Param, Query } from '@nestjs/common';
import { InfluencersInsightService } from './influencers-insight.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GraphParamsDto } from '../dto/graph-params.dto';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { InfluencerFilterParamsDto } from './dto/influencer-filter-params.dto';
import { GraphResultEntity } from '../entities/graph-result.entity';
import { InfluencerCampaignFilterParamsDto } from './dto/campaign-filter-params.dto';
import { InfluencerFinanceFilterParamsDto } from './dto/finance-filter-params.dto copy';
import { InfluencerBenefitFilterParamsDto } from './dto/benefit-filter-param.dto';
import { SurveyType } from 'src/core/surveys/enums/survey-type.enum';
import { PostType } from 'src/core/influencer/subroutes/desired-income/campaign/enums/post-type.enum';
import { UserGraphParamsDto } from '../dto/user-graph-params.dto';
// import { cacheKeys } from 'src/config';
// import { milliseconds } from 'date-fns';
// import { CacheAndInvalidate } from 'src/decorators/cache-and-invalidate.decorator';

@Controller('insight/influencers')
@ApiTags('insight', 'influencer')
export class InfluencerInsightController {
  constructor(private readonly influencersService: InfluencersInsightService) {}

  @Get('influencersOverTimeData')
  @CheckAbilities({ action: Action.Manage, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Return a number of influencers (graph data)',
    description:
      'Retrieves a number of influencers through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  // @CacheAndInvalidate(milliseconds({ days: 1 }), cacheKeys.insightInfluencers)
  async influencersOverTimeData(
    @Query() graphParams: GraphParamsDto,
    @Query() influencerFilterParamsDto: InfluencerFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.influencersService.getInfluencersCountData(
        graphParams,
        influencerFilterParamsDto,
      ),
    );
  }

  @Get('influencerCampaignsOverTimeData/:userId')
  // @CheckAbilities({ action: Action.Manage, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Return a number of influencer campaigns (graph data)',
    description:
      'Retrieves a number of influencer campaigns through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async influencerCampaignsOverTimeData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
    @Query()
    influencerCampaignFilterParamsDto: InfluencerCampaignFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.influencersService.getInfluencerCampaignsCountData(
        id,
        graphParams,
        influencerCampaignFilterParamsDto,
      ),
    );
  }

  @Get('influencerSurveysOverTimeData/:userId')
  // @CheckAbilities({ action: Action.Manage, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Return a number of influencer surveys (graph data)',
    description:
      'Retrieves a number of influencer surveys through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async influencerSurveysOverTimeData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
    @Query()
    influencerCampaignFilterParamsDto: InfluencerCampaignFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.influencersService.getInfluencerSurveysCountData(
        id,
        graphParams,
        influencerCampaignFilterParamsDto,
      ),
    );
  }

  @Get('influencerPlatformProductsIncomeData/:userId')
  // @CheckAbilities({ action: Action.Manage, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Return an income of influencer (graph data)',
    description:
      'Retrieves an income of influencer through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async influencerPlatformProductsIncomeData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
    @Query()
    influencerFinanceFilterParamsDto: InfluencerFinanceFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.influencersService.getInfluencerPlatformProductsIncomeData(
        id,
        graphParams,
        influencerFinanceFilterParamsDto,
      ),
    );
  }

  @Get('influencerAffiliateIncomeData/:userId')
  // @CheckAbilities({ action: Action.Manage, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Return an affiliate income of influencer (graph data)',
    description:
      'Retrieves an affiliate income of influencer through time within given time period.',
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async influencerAffiliateIncomeData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
  ) {
    return new GraphResultEntity(
      await this.influencersService.getInfluencerAffiliateIncomeData(
        id,
        graphParams,
      ),
    );
  }

  @Get('influencerBenefitSuggestionsData/:userId')
  @CheckAbilities({ action: Action.Manage, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Return influencer benefit suggestions (graph data)',
    description:
      "Retrieves influencer's benefit suggestions through time within given time period.",
  })
  @ApiOkResponse({
    type: GraphResultEntity,
  })
  async influencerBenefitSuggestionsData(
    @Param('userId') id: number,
    @Query() graphParams: UserGraphParamsDto,
    @Query()
    influencerBenefitFilterParamsDto: InfluencerBenefitFilterParamsDto,
  ) {
    return new GraphResultEntity(
      await this.influencersService.getInfluencerBenefitsData(
        id,
        graphParams,
        influencerBenefitFilterParamsDto,
      ),
    );
  }

  @Get('surveyDesiredAmountDistribution/:userId')
  @CheckAbilities({ action: Action.Read, subject: 'Influencer' })
  @ApiOperation({
    summary:
      'Return influencer survey desired amount distribution (graph data)',
  })
  async surveyDesiredAmountDistribution(
    @Param('userId') id: number,
    @Query() { surveyType }: { surveyType: SurveyType },
  ) {
    return await this.influencersService.surveyDesiredAmountDistribution(
      id,
      surveyType,
    );
  }

  @Get('campaignDesiredAmountDistribution/:userId')
  @CheckAbilities({ action: Action.Read, subject: 'Influencer' })
  @ApiOperation({
    summary:
      'Return influencer campaign desired amount distribution (graph data)',
  })
  async campaignDesiredAmountDistribution(
    @Param('userId') id: number,
    @Query() { postType }: { postType: PostType },
  ) {
    return await this.influencersService.campaignDesiredAmountDistribution(
      id,
      postType,
    );
  }
}
