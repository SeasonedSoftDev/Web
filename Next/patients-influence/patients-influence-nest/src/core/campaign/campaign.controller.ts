import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  Put,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from '../auth/decorators';
import { Campaign, User } from '@prisma/client';
import { CampaignEntity } from './entities/campaign.entity';
import { Response } from 'express';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { CampaignPaginationEntity } from './entities/campaign-pagination.entity';
import { CheckAbilities } from '../auth/ability/decorators/ability.decorator';
import { Action } from '../auth/ability';
import { serializeArray } from 'src/utils/serializers/array.serializer';
import { PlatformProductOrderInfluencerEntity } from '../platform-product/entities/platform-product-order-influencer.entity';
import { BatchPayloadEntity } from 'src/utils/entities/batch-payload.entity';
import { UserRole } from 'src/utils';
import { SubmitInfluencerDataDto } from './dto/submit-influencer-data.dto';
import { OrderReportDto } from './dto/order-report.dto';
// import { Throttle } from '@nestjs/throttler';
import { EnumItemResult } from 'src/utils/object-definitions/results/enum-item-result';
import { serializeEnum } from 'src/utils/serializers/enum-result.serializer';
import { ReportType } from './enums/report.enum';
import { UserEntity } from '../users/entities/user.entity';
import { CampaignFiltersDto } from './dto';
import { CampaignFilterDto } from './dto/campaign--filter.dto';
import { CampaignReportFilterDto } from './dto/campaign-report-filter.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ProductOrderInfluencerStatus } from '../platform-product/enums/product-order-influencer-status.enum';
import { CampaignReportEntity } from './entities/campaign-report.entity';
import { CampaignReportPaginationEntity } from './entities/campaign-report-pagination.entity';
import { cacheKeys } from 'src/config';
import { CacheInvalidate } from 'src/decorators/cache-invalidate.decorator';
import { DeleteManyCampaignsDto } from './dto/delete-many-campaigns.dto';
import { DeleteManyCampaignReportsDto } from './dto/delete-many-campaign-reports.dto';
import { CampaignInviteInfluencers } from './dto/campaing-invite-influencers.dto';
import { CampaignConfirmMatchDto } from './dto/campaign-confirm-match.dto';
import { CampaignApproveInfluencers } from './dto/campaign-approve-influencers.dto';
import { FindByIdsDto } from '../finance/dto/find-by-ids.dto';

@Controller('campaign')
@ApiTags('campaign')
export class CampaignController {
  private static readonly cacheInvalidateOnCampaignCreate = [
    cacheKeys.insightClientCampaigns, // count campaigns
    cacheKeys.insightClientCampaignInfluencers, // count campaign influencers
    cacheKeys.insightClientCampaignPerformances,
  ];
  private static readonly cacheInvalidateOnCampaignUpdate =
    CampaignController.cacheInvalidateOnCampaignCreate;
  private static readonly cacheInvalidateOnCampaignDelete =
    CampaignController.cacheInvalidateOnCampaignCreate;
  private static readonly cacheInvalidateOnCampaignInfluencersUpdate = [
    cacheKeys.insightClientCampaignInfluencers,
    cacheKeys.insightClientCampaignPerformances,
  ];
  private static readonly cacheInvalidateOnCampaignReportCreate = [
    cacheKeys.insightClientCampaignReports, // count campaign reports
  ];
  private static readonly cacheInvalidateOnCampaignReportUpdate =
    CampaignController.cacheInvalidateOnCampaignReportCreate;

  constructor(private readonly campaignService: CampaignService) {}

  @Get('track')
  // * 1 day = 86 400 seconds
  // it is important to track by an IP
  // @Throttle(1, 86400)
  async track(@Res() res: Response, @Query('c') code: string) {
    const link = await this.campaignService.track(code);

    return res.redirect(link);
  }

  @Get('exportReports')
  async exportReports(@Query() dto: FindByIdsDto, @AuthUser() user: User) {
    return await this.campaignService.exportReports(dto, user);
  }

  @Get('campaignsAndSurveysDates')
  async campaignsAndSurveysDates(@AuthUser() user: User) {
    return await this.campaignService.campaignsAndSurveysDates(user);
  }

  @Get('exports')
  async exportCampaigns(@Query() dto: FindByIdsDto, @AuthUser() user: User) {
    return this.campaignService.exportCampaigns(dto, user);
  }

  //#region REPORTS
  @Get('reportTypes')
  @ApiOperation({
    summary: 'Get report types',
    description:
      'Retrieves available report types (report type enum/property).',
  })
  @ApiOkResponse({ type: EnumItemResult, isArray: true })
  @ApiTags('enums and types')
  @NoAutoSerialize()
  getAvailableReportTypes(@Res() res: Response) {
    return res.json(serializeEnum(ReportType));
  }

  @Delete('/reports/deleteSelectedReports')
  @CheckAbilities({ action: Action.Update, subject: 'CampaignReport' })
  @ApiOperation({
    summary: 'Delete the list of campaign reports',
    description:
      'Removes the selected list of campaign reports from the database. This action is irreversible.',
  })
  @ApiOkResponse({
    description: 'Campaign reports are removed from the database',
    type: CampaignEntity,
  })
  @CacheInvalidate(...CampaignController.cacheInvalidateOnCampaignDelete)
  async deleteManyReports(
    @Body() dto: DeleteManyCampaignReportsDto,
    @AuthUser() user: UserEntity,
  ) {
    if (user.role !== UserRole.SuperAdmin && user.role !== UserRole.Admin)
      throw new UnauthorizedException();
    return this.campaignService.deleteManyReports(dto);
  }

  @Post('reports')
  @CheckAbilities({ action: Action.Create, subject: 'CampaignReport' })
  @ApiBody({
    type: OrderReportDto,
  })
  @CacheInvalidate(...CampaignController.cacheInvalidateOnCampaignReportCreate)
  async orderReport(
    @Body() orderReportDto: OrderReportDto,
    @AuthUser() user: User,
  ) {
    return this.campaignService.orderReport(orderReportDto, user);
  }

  @Delete('/deleteSelectedCampaigns')
  @CheckAbilities({ action: Action.Update, subject: 'Campaign' })
  @ApiOperation({
    summary: 'Delete the list of campaigns',
    description:
      'Removes the selected list of campaigns from the database. This action is irreversible.',
  })
  @ApiOkResponse({
    description: 'Campaigns are removed from the database',
    type: CampaignEntity,
  })
  @CacheInvalidate(...CampaignController.cacheInvalidateOnCampaignDelete)
  async deleteMany(
    @Body() dto: DeleteManyCampaignsDto,
    @AuthUser() user: UserEntity,
  ) {
    if (user.role !== UserRole.SuperAdmin && user.role !== UserRole.Admin)
      throw new UnauthorizedException();
    return this.campaignService.deleteMany(dto);
  }

  @Patch('reports/:reportId')
  @CheckAbilities({ action: Action.Update, subject: 'CampaignReport' })
  @ApiBody({
    type: UpdateReportDto,
  })
  @CacheInvalidate(...CampaignController.cacheInvalidateOnCampaignReportUpdate)
  async updateReport(
    @Param('reportId') reportId,
    @Body() orderReportDto: OrderReportDto,
    @AuthUser() user: User,
  ) {
    return this.campaignService.updateReport(reportId, orderReportDto, user);
  }

  @Delete('reports/:reportId')
  @CheckAbilities({ action: Action.Delete, subject: 'CampaignReport' })
  @ApiOkResponse({
    description: 'Reports deleted',
    type: CampaignEntity,
  })
  @CacheInvalidate(...CampaignController.cacheInvalidateOnCampaignDelete)
  async removeReport(@Param('reportId') id: number) {
    return await this.campaignService.removeReport(id);
  }

  @Put('reports/:reportId/ready')
  @CheckAbilities({ action: Action.Update, subject: 'CampaignReport' })
  @CacheInvalidate(...CampaignController.cacheInvalidateOnCampaignReportUpdate)
  async markReportAsReady(@Param('reportId') reportId: number) {
    return this.campaignService.markReportAsReady(reportId);
  }

  @Put('reports/:reportId/deliver')
  @CheckAbilities({ action: Action.Update, subject: 'CampaignReport' })
  @CacheInvalidate(...CampaignController.cacheInvalidateOnCampaignReportUpdate)
  async deliverReport(@Param('reportId') reportId: number) {
    return this.campaignService.deliverReport(reportId);
  }

  @Get('reports')
  @CheckAbilities({ action: Action.Read, subject: 'CampaignReport' })
  @ApiOperation({
    summary: 'Get campaign report/s (filter)',
    description:
      'Retrieves the campaign reports by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    description: 'Campaign report/s retrieved',
    type: CampaignReportPaginationEntity,
  })
  @NoAutoSerialize()
  async getReports(
    @Query() filterParamsDto: FilterParamsDto,
    @Query() filters: CampaignReportFilterDto,
    @AuthUser() user: User,
  ) {
    return serializePaginationResult(
      this.campaignService.getReports(filterParamsDto, filters, user),
      CampaignReportEntity,
    );
  }

  //#region ENUMS
  @Get('campaignInfluencerStatuses')
  // ? @CheckAbilities({ action: Action.Read, subject: 'Campaign' })
  @ApiOperation({
    summary: 'Get campaign influencer statuses',
    description:
      'Retrieves available campaign influencer statuses (product order influencer status enum/property).',
  })
  @ApiOkResponse({ type: EnumItemResult, isArray: true })
  @ApiTags('enums and types')
  @NoAutoSerialize()
  getAvailableCampaignInfluencerStatuses(@Res() res: Response) {
    return res.json(serializeEnum(ProductOrderInfluencerStatus));
  }
  //#endregion

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'Campaign' })
  @ApiOperation({
    summary: 'Create a new campaign',
    description: 'Creates a new campaign.',
  })
  @ApiBody({ type: CreateCampaignDto })
  @ApiCreatedResponse({ type: CampaignEntity })
  @CacheInvalidate(...CampaignController.cacheInvalidateOnCampaignCreate)
  async create(
    @Body() createCampaignDto: CreateCampaignDto,
    @AuthUser() user: User,
  ) {
    // return await this.campaignService.create(createCampaignDto, user);
    return new CampaignEntity(
      await this.campaignService.create(createCampaignDto, user),
    );
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'Campaign' })
  @ApiOperation({
    summary: 'Get campaign/s (filter)',
    description:
      'Retrieves the campaigns by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    description: 'Campaign/s retrieved',
    type: CampaignPaginationEntity,
  })
  @NoAutoSerialize()
  findAll(
    @Query() filterParamsDto: FilterParamsDto,
    @Query() filters: CampaignFilterDto,
    @AuthUser() user: User,
  ) {
    return serializePaginationResult(
      this.campaignService.findAll(filterParamsDto, filters, user),
      CampaignEntity,
    );
  }

  @Get('allCampaigns')
  @CheckAbilities({ action: Action.Read, subject: 'Campaign' })
  @ApiOperation({
    summary: 'Get campaign/s (filter)',
    description:
      'Retrieves the campaigns by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    description: 'Campaign/s retrieved',
    type: CampaignPaginationEntity,
  })
  @NoAutoSerialize()
  findAllCampaigns(
    @Query() filterParamsDto: FilterParamsDto,
    @AuthUser() user: User,
  ) {
    return serializePaginationResult(
      this.campaignService.findAllCampaigns(filterParamsDto, user),
      CampaignEntity,
    );
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: 'Campaign' })
  @ApiOkResponse({
    description: 'Campaign retrieved',
    type: CampaignEntity,
  })
  async findOne(@Param('id') id: number) {
    return new CampaignEntity(await this.campaignService.findOne(id));
  }

  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: 'Campaign' })
  @ApiOperation({
    summary: 'Update a campaign',
    description: 'Updates a campaign',
  })
  @ApiBody({ type: UpdateCampaignDto })
  @ApiOkResponse({ type: CampaignEntity })
  @CacheInvalidate(...CampaignController.cacheInvalidateOnCampaignUpdate)
  async update(
    @Param('id') id: number,
    @Body() updateCampaignDto: UpdateCampaignDto,
    @AuthUser() user: User,
  ) {
    return new CampaignEntity(
      await this.campaignService.update(id, updateCampaignDto, user),
    );
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: 'Campaign' })
  @ApiOkResponse({
    description: 'Campaign deleted',
    type: CampaignEntity,
  })
  @CacheInvalidate(...CampaignController.cacheInvalidateOnCampaignDelete)
  async remove(@Param('id') id: number) {
    return new CampaignEntity(await this.campaignService.remove(id));
  }

  /* @Get(':id/influencers')
  async getInfluencers(@Param('id') id: number) {
    return await this
  } */

  @Post(':id/addInfluencers')
  @ApiBody({
    description: 'User IDs',
    type: Number,
    isArray: true,
  })
  @ApiCreatedResponse({
    type: PlatformProductOrderInfluencerEntity,
    isArray: true,
  })
  @NoAutoSerialize()
  @CacheInvalidate(
    ...CampaignController.cacheInvalidateOnCampaignInfluencersUpdate,
  )
  async addInfluencers(
    @Param('id') id: number,
    @Body() influencerIds: number[],
  ) {
    return serializeArray(
      this.campaignService.addInfluencers(id, influencerIds),
      PlatformProductOrderInfluencerEntity,
    );
  }

  @Put(':id/inviteInfluencers')
  @ApiBody({
    description: 'User IDs',
    type: Number,
    isArray: true,
  })
  @ApiOkResponse({
    type: PlatformProductOrderInfluencerEntity,
    isArray: true,
  })
  @NoAutoSerialize()
  @CacheInvalidate(
    ...CampaignController.cacheInvalidateOnCampaignInfluencersUpdate,
  )
  async inviteInfluencers(
    @Param('id') id: number,
    @Body() dto: CampaignInviteInfluencers,
    @AuthUser() user: User,
  ) {
    return serializeArray(
      this.campaignService.inviteInfluencers(id, dto, user),
      PlatformProductOrderInfluencerEntity,
    );
  }

  @Put(':id/acceptInvitation')
  @ApiOkResponse({
    type: PlatformProductOrderInfluencerEntity,
  })
  @CacheInvalidate(
    ...CampaignController.cacheInvalidateOnCampaignInfluencersUpdate,
  )
  async acceptInvitation(@Param('id') id: number, @AuthUser() user: User) {
    return new PlatformProductOrderInfluencerEntity(
      await this.campaignService.acceptInvitation(id, user),
    );
  }

  @Put(':id/declineInvitation')
  @ApiOkResponse({
    type: PlatformProductOrderInfluencerEntity,
  })
  @CacheInvalidate(
    ...CampaignController.cacheInvalidateOnCampaignInfluencersUpdate,
  )
  async declineInvitation(@Param('id') id: number, @AuthUser() user: User) {
    return new PlatformProductOrderInfluencerEntity(
      await this.campaignService.declineInvitation(id, user),
    );
  }

  @Delete(':id/removeInfluencers')
  @ApiBody({
    description: 'User IDs',
    type: Number,
    isArray: true,
  })
  @ApiOkResponse({
    type: BatchPayloadEntity,
  })
  @NoAutoSerialize()
  @CacheInvalidate(
    ...CampaignController.cacheInvalidateOnCampaignInfluencersUpdate,
  )
  async removeInfluencers(
    @Param('id') id: number,
    @Body() influencerIds: number[],
    @AuthUser() user: User,
  ) {
    if (user.role === UserRole.Influencer) {
      return this.campaignService.removeInfluencerSelf(id, user);
    }

    return this.campaignService.removeInfluencers(id, influencerIds);
  }

  @Post(':id/submitInfluencerData')
  @ApiBody({
    type: SubmitInfluencerDataDto,
  })
  /* @ApiCreatedResponse({
    type: undefined,
  }) */
  @CacheInvalidate(
    ...CampaignController.cacheInvalidateOnCampaignInfluencersUpdate,
  )
  async submitInfluencerData(
    @Param('id') id: number,
    @Body() data: SubmitInfluencerDataDto,
    @AuthUser() user: User,
  ) {
    return this.campaignService.submitInfluencerData(id, user, data);
  }

  @Put(':id/confirmMatch')
  @ApiBody({
    description: 'User IDs',
    type: Number,
    isArray: true,
  })
  @ApiOkResponse({
    type: BatchPayloadEntity,
  })
  @CacheInvalidate(
    ...CampaignController.cacheInvalidateOnCampaignInfluencersUpdate,
  )
  async confirmMatch(
    @Param('id') id: number,
    @Body() dto: CampaignConfirmMatchDto,
  ) {
    return this.campaignService.confirmMatch(id, dto);
  }

  @Put(':id/approveSubmission')
  @ApiBody({
    description: 'User IDs',
    type: Number,
    isArray: true,
  })
  @ApiOkResponse({
    type: BatchPayloadEntity,
  })
  @CacheInvalidate(
    ...CampaignController.cacheInvalidateOnCampaignInfluencersUpdate,
  )
  async approveSubmission(
    @Param('id') id: number,
    @Body() dto: CampaignApproveInfluencers,
    @AuthUser() user: User,
  ) {
    return this.campaignService.approveSubmission(id, dto, user);
  }

  @Put(':id/disapproveSubmission')
  @ApiBody({
    description: 'User IDs',
    type: Number,
    isArray: true,
  })
  @ApiOkResponse({
    type: BatchPayloadEntity,
  })
  @CacheInvalidate(
    ...CampaignController.cacheInvalidateOnCampaignInfluencersUpdate,
  )
  async disapproveSubmission(
    @Param('id') id: number,
    @Body() dto: CampaignApproveInfluencers,
    @AuthUser() user: User,
  ) {
    return this.campaignService.disapproveSubmission(id, dto, user);
  }

  //#region CHANGE CAMPAIGN STATUS
  @Put(':id/startCampaign')
  @CacheInvalidate(...CampaignController.cacheInvalidateOnCampaignUpdate)
  async startCampaign(@Param('id') id: number, @AuthUser() user: User) {
    if (user.role !== UserRole.SuperAdmin) {
      throw new UnauthorizedException();
    }
    return this.campaignService.startCampaign(id);
  }

  @Put(':id/finishCampaign')
  @CacheInvalidate(...CampaignController.cacheInvalidateOnCampaignUpdate)
  async finishCampaign(@Param('id') id: number, @AuthUser() user: User) {
    if (user.role !== UserRole.SuperAdmin) {
      throw new UnauthorizedException();
    }
    return this.campaignService.finishCampaign(id);
  }

  @Put(':id/archiveCampaign')
  @CacheInvalidate(...CampaignController.cacheInvalidateOnCampaignUpdate)
  async archiveCampaign(@Param('id') id: number) {
    return this.campaignService.archiveCampaign(id);
  }
  //#endregion

  // TODO refactor
  @Get(':id/performances')
  async getPerformances(@Param('id') id: number) {
    return this.campaignService.calculateInfluencersPerformances(id);
  }

  @Post('getCampaigns')
  @NoAutoSerialize()
  findAllInfluencers(
    @Query() pagination: FilterParamsDto,
    @Body()
    dto: CampaignFiltersDto,
    @AuthUser()
    user: UserEntity,
  ) {
    if (user.role !== UserRole.SuperAdmin) throw new UnauthorizedException();

    return serializePaginationResult<Campaign, CampaignEntity>(
      this.campaignService.findAllCampaignsByFilters(pagination, dto),
      CampaignEntity,
    );
  }
}
