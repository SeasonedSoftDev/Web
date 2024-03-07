import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreatePlatformProductOrderDto } from './dto';
import { PlatformProductOrderService } from './platform-product-order.service';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import {
  PlatformProductOrder,
  User,
  PlatformProductOrderInfluencer,
} from '@prisma/client';
import { PlatformProductOrderEntity } from './entities';
import { FilterParamsDto } from '../../utils/object-definitions/dtos/filter-params.dto';
import { UpdatePlatformProductOrderDto } from './dto/update-platform-product-order.dto';
import { AddInfluencersDto } from './dto/add-influencers.dto';
import { AddInfluencersEntity } from './entities/add-influencers.entity';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnumItemResult } from 'src/utils/object-definitions/results/enum-item-result';
import { Language } from './enums/language.enum';
import { serializeEnum } from 'src/utils/serializers/enum-result.serializer';
import { Response } from 'express';
import { PlatformProduct } from './enums/platform-product.enum';
import { FinanceStatus } from '../campaign/enums/finance-status.enum';
import { ReceivePendingRevenuesDto } from './dto/receive-pending-revenues.dto';
import { ApprovePaymentsDto } from './dto/approve-payments.dto';
import { Public } from '../auth/decorators';
import { PlatformProductOrderInfluencerEntity } from './entities/platform-product-order-influencer.entity';
import { AuthUser } from '../auth/decorators';
import { PlatformProductOrderInfluencerPagination } from './entities/platform-product-influencers-pagination.entity';
import { FindByIdsDto } from '../finance/dto/find-by-ids.dto';
import { FindByUserDto } from './dto/find-by-user.dto';
import { RevenueFilterDto } from './dto/revenue-filter.dto';

@Controller('platformProduct')
@ApiTags('platform product order')
export class PlatformProductController {
  constructor(
    private readonly platformProductOrderService: PlatformProductOrderService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve platform product orders',
    description:
      'Retrieves platform product orders by filtering them, sorting and doing all kinds of other operations.',
  })
  @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() filterParamsDto: FilterParamsDto) {
    return serializePaginationResult<
      PlatformProductOrder,
      PlatformProductOrderEntity
    >(
      this.platformProductOrderService.findAll(filterParamsDto),
      PlatformProductOrderEntity,
    );
  }

  @Get('productsByUser')
  @ApiOperation({
    summary: 'Retrieve platform product orders by user',
    description:
      'Retrieves platform product orders by filtering them, sorting and doing all kinds of other operations.',
  })
  @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  findAllByUser(@Query() dto: FindByUserDto) {
    return this.platformProductOrderService.findAllByUserId(
      dto.userId,
      dto.search,
    );
  }

  @Get('revenues')
  @ApiOperation({
    summary: 'Retrieve platform product orders by financeStatus',
    description:
      'Retrieves platform product orders by filtering them, sorting and doing all kinds of other operations.',
  })
  @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  findAllRevenue(
    @Query() filterParamsDto: FilterParamsDto,
    @Query('financeStatus', ParseIntPipe) financeStatus: FinanceStatus,
    @Query() filterParams: RevenueFilterDto,
  ) {
    return serializePaginationResult<
      PlatformProductOrder,
      PlatformProductOrderEntity
    >(
      this.platformProductOrderService.findAllByFinanceStatus(
        filterParamsDto,
        financeStatus,
        filterParams,
      ),
      PlatformProductOrderEntity,
    );
  }

  @Get('allRevenues')
  async findAllRevenues(@Query() dto: FindByIdsDto) {
    return await this.platformProductOrderService.getAllByFinanceStatus(dto);
  }

  @Post()
  @ApiOperation({
    summary: 'Make platform product order',
    description:
      'Creates platform product order with no sense of which product it is. This is most commonly used in development or test environment.',
  })
  @HttpCode(HttpStatus.CREATED)
  async createPlatformProductOrder(@Body() dto: CreatePlatformProductOrderDto) {
    const res =
      await this.platformProductOrderService.createPlatformProductOrder(dto);
    return new PlatformProductOrderEntity(res);
  }

  @Get('languages')
  // ? @CheckAbilities({ action: Action.Read, subject: 'Campaign' }, { action: Action.Read, subject: 'Survey' })
  @ApiOperation({
    summary: 'Get languages',
    description: 'Retrieves available languages (language enum/property).',
  })
  @ApiOkResponse({ type: EnumItemResult, isArray: true })
  @ApiTags('enums and types')
  @NoAutoSerialize()
  getAvailableLanguages(@Res() res: Response) {
    return res.json(serializeEnum(Language));
  }

  @Get('platformProducts')
  // ? @CheckAbilities({ action: Action.Read, subject: 'Campaign' })
  @ApiOperation({
    summary: 'Get platform products',
    description:
      'Retrieves available platform products (platform product enum/property).',
  })
  @ApiOkResponse({ type: EnumItemResult, isArray: true })
  @ApiTags('enums and types')
  @NoAutoSerialize()
  getAvailablePlatformProducts(@Res() res: Response) {
    return res.json(serializeEnum(PlatformProduct));
  }

  @Patch('/receivePendingRevenues')
  @ApiOperation({
    summary: 'Receive pending revenues',
    description: 'Flags the list of products as received.',
  })
  @ApiOkResponse({
    description: 'Flags the list of products as received.',
    type: PlatformProductOrderEntity,
  })
  async receivePendingRevenues(@Body() dto: ReceivePendingRevenuesDto) {
    return await this.platformProductOrderService.receivePendingRevenues(dto);
  }

  @Patch('/updatePlatformProductPayments')
  @Public()
  @ApiOperation({
    summary: 'Approve payments',
    description: 'Updates payments status for the list of products.',
  })
  @ApiOkResponse({
    description: 'Updates payments status for the list of products.',
    type: PlatformProductOrderEntity,
  })
  async approvePayments(@Body() dto: ApprovePaymentsDto) {
    return await this.platformProductOrderService.updatePlatformProductPayments(
      dto,
    );
  }

  @Get('costs')
  @ApiOperation({
    summary: 'Retrieve platform product orders cost',
    description:
      'Retrieves platform product orders cost by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    type: PlatformProductOrderInfluencerEntity,
    description:
      'Retrieves platform product orders cost that have status approved',
  })
  @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  async findAllCost(@Query() filterParamsDto: FilterParamsDto) {
    return serializePaginationResult<
      PlatformProductOrderInfluencer,
      PlatformProductOrderInfluencerEntity
    >(
      this.platformProductOrderService.findAllApprovedAgreedAmounts(
        filterParamsDto,
      ),
      PlatformProductOrderInfluencerEntity,
    );
  }

  @Get(':id/campaign/influencers')
  @ApiOperation({
    summary: 'Retrieve single platform influencers product order',
    description: 'Retrieve single platform product order by its ID.',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PlatformProductOrderInfluencerPagination })
  async findOneByIdInfluencers(
    @Param('id', ParseIntPipe) id: number,
    @Query() filterParamsDto: FilterParamsDto,
    @AuthUser() user: User,
  ) {
    const productOrderInfluencers =
      await this.platformProductOrderService.findOneByIdInfluencersCampaing(
        filterParamsDto,
        id,
        user,
      );

    return serializePaginationResult(
      productOrderInfluencers,
      PlatformProductOrderInfluencerEntity,
    );
  }

  @Get(':id/survey/influencers')
  @ApiOperation({
    summary: 'Retrieve single platform influencers product order',
    description: 'Retrieve single platform product order by its ID.',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PlatformProductOrderInfluencerPagination })
  async findOneByIdInfluencersSurvey(
    @Param('id', ParseIntPipe) id: number,
    @Query() filterParamsDto: FilterParamsDto,
    @AuthUser() user: User,
  ) {
    const productOrderInfluencers =
      await this.platformProductOrderService.findOneByIdInfluencersSurvey(
        filterParamsDto,
        id,
        user,
      );

    return serializePaginationResult(
      productOrderInfluencers,
      PlatformProductOrderInfluencerEntity,
    );
  }

  @Get(':id/campaign')
  @ApiOperation({
    summary: 'Retrieve single platform influencers product order',
    description: 'Retrieve single platform product order by its ID.',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PlatformProductOrderInfluencerPagination })
  async findPlatformProductCampaign(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: User,
  ) {
    const platformProductCampaign =
      await this.platformProductOrderService.findPlatformProductCampaign(
        id,
        user,
      );

    return platformProductCampaign;
  }

  @Get(':id/survey')
  @ApiOperation({
    summary: 'Retrieve single platform influencers product order',
    description: 'Retrieve single platform product order by its ID.',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PlatformProductOrderInfluencerPagination })
  async findPlatformProductSurvey(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: User,
  ) {
    const platformProductSurvey =
      await this.platformProductOrderService.findPlatformProductSurvey(
        id,
        user,
      );

    return platformProductSurvey;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Retrieve splatform product order',
    description: 'Deletese platform product order by its ID.',
  })
  async updateOneById(
    @Body() dto: UpdatePlatformProductOrderDto,
    @Param('id') id: number,
  ) {
    const res = await this.platformProductOrderService.updateOneById(id, dto);
    return new PlatformProductOrderEntity(res);
  }

  @Post('add-influencer')
  @NoAutoSerialize()
  async addInfluencer(@Body() dto: AddInfluencersDto) {
    return new AddInfluencersEntity(
      await this.platformProductOrderService.addInfluencers(dto),
    );
  }
}
