import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BenefitService } from './benefit.service';
import {
  CreateBenefitCateogryDto,
  CreateBenefitDto,
  CreateBenefitSuggestionDto,
  EditBenefitCateogryDto,
  EditBenefitDto,
  EditBenefitSuggestionDto,
} from './dto';
import { AuthUser } from '../auth/decorators';
import {
  Benefit,
  BenefitCategory,
  BenefitSuggestion,
  User,
} from '@prisma/client';
import { FilterParamsDto } from '../../utils/object-definitions/dtos/filter-params.dto';
import { NoAutoSerialize } from '../../decorators/no-auto-serialize.decorator';
import { serializePaginationResult } from '../../utils/serializers/pagination-result.serializer';
import {
  BenefitCategoryEntity,
  BenefitEntity,
  BenefitSuggestionEntity,
} from './entities';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BenefitPaginationResult,
  BenefitSuggestionPaginationResult,
} from './utils';
import { serializeArray } from 'src/utils/serializers/array.serializer';
import { CheckAbilities } from '../auth/ability/decorators/ability.decorator';
import { Action } from '../auth/ability';
import { GetBenefitSuggestionsFilterDto } from './dto/get-benefit-suggestions-filter.dto';
import { UserRole } from 'src/utils';
import { ForbiddenApplicationException } from 'src/exceptions/application.exception';
import { DeleteApproveManySuggestionsDto } from './dto/delete-approve-many-suggestions.dto';
import { DeleteManyBenefitsDto } from './dto/delete-many-benefits.dto';
import { FindByIdsDto } from '../finance/dto/find-by-ids.dto';
import { BenefitFilterDto } from './dto/benefit-filter.dto';

@Controller('benefits')
@ApiTags('benefits')
export class BenefitController {
  constructor(private readonly benefitService: BenefitService) {}

  @Get()
  @NoAutoSerialize()
  @ApiOkResponse({ type: BenefitPaginationResult })
  getBenefits(@Query() paginationParamsDto: BenefitFilterDto) {
    return serializePaginationResult<Benefit, BenefitEntity>(
      this.benefitService.getBenefits(paginationParamsDto),
      BenefitEntity,
    );
  }

  @Get('exports')
  async exportCampaigns(@Query() dto: FindByIdsDto) {
    return this.benefitService.export(dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Gets benefit categories' })
  @ApiResponse({ isArray: true, type: BenefitCategoryEntity })
  @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  async getBenefitCategories() {
    return serializeArray<BenefitCategory, BenefitCategoryEntity>(
      await this.benefitService.getBenefitCategories(),
      BenefitCategoryEntity,
    );
  }

  // TODO add Entity
  @Get('partnerships')
  @ApiOperation({ summary: 'Gets benefit partnerships' })
  // @ApiResponse({ isArray: true, type: BenefitCategoryEntity })
  // @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  async getBenefitPartnerships(@Query() paginationParamsDto: FilterParamsDto) {
    return await this.benefitService.getBenefitPartnerships(
      paginationParamsDto,
    );
    /* return serializeArray<BenefitCategory, BenefitCategoryEntity>(
      await this.benefitService.getBenefitCategories(),
      BenefitCategoryEntity,
    ); */
  }

  @Get('suggestions')
  @CheckAbilities({ action: Action.Read, subject: 'BenefitSuggestion' })
  @NoAutoSerialize()
  @ApiOkResponse({ type: BenefitSuggestionPaginationResult })
  getBenefitSuggestions(
    @Query() paginationParamsDto: GetBenefitSuggestionsFilterDto,
    @AuthUser() user: User,
  ) {
    return serializePaginationResult<
      BenefitSuggestion,
      BenefitSuggestionEntity
    >(
      this.benefitService.getBenefitSuggestions(paginationParamsDto, user),
      BenefitSuggestionEntity,
    );
  }

  @Post('categories')
  @ApiOperation({ summary: 'Creates benefit category' })
  async createBenefitCategory(@Body() dto: CreateBenefitCateogryDto) {
    return this.benefitService.createBenefitCategory(dto);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Edit benefit category' })
  async editBenefitCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditBenefitCateogryDto,
  ) {
    return this.benefitService.editBenefitCategory(id, dto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete benefit category' })
  async deleteBenefitCategory(@Param('id', ParseIntPipe) id: number) {
    return this.benefitService.deleteBenefitCategory(id);
  }

  @Get(':id')
  async getBenefit(@Param('id', ParseIntPipe) id: number) {
    return new BenefitEntity(await this.benefitService.getBenefit(id));
  }

  @Post()
  async createBenefit(@Body() dto: CreateBenefitDto, @AuthUser() user: User) {
    if (user.role !== UserRole.SuperAdmin) {
      throw new ForbiddenApplicationException(
        'Only Admins can create benefits.',
      );
    }
    return new BenefitEntity(await this.benefitService.createBenefit(dto));
  }
  @Delete('/deleteMany')
  async deleteManyBenefits(
    @Body() dto: DeleteManyBenefitsDto,
    @AuthUser() user: User,
  ) {
    return await this.benefitService.deleteManyBenefits(dto, user);
  }
  @Patch(':id')
  async editBenefit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditBenefitDto,
    @AuthUser() user: User,
  ) {
    if (user.role !== UserRole.SuperAdmin) {
      throw new ForbiddenApplicationException(
        'Only Admins can update benefits.',
      );
    }
    return new BenefitEntity(await this.benefitService.editBenefit(id, dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBenefit(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: User,
  ) {
    if (user.role !== UserRole.SuperAdmin) {
      throw new ForbiddenApplicationException(
        'Only Admins can delete benefits.',
      );
    }
    return new BenefitEntity(await this.benefitService.deleteBenefit(id));
  }

  @Get('suggestions/:id')
  @CheckAbilities({ action: Action.Read, subject: 'BenefitSuggestion' })
  async getBenefitSuggestion(@Param('id', ParseIntPipe) id: number) {
    return new BenefitSuggestionEntity(
      await this.benefitService.getBenefitSuggestion(id),
    );
  }

  @Post('suggestions')
  @CheckAbilities({ action: Action.Create, subject: 'BenefitSuggestion' })
  async createBenefitSuggestion(
    @Body() dto: CreateBenefitSuggestionDto,
    @AuthUser() user: User,
  ) {
    if (user.role === UserRole.Client) {
      throw new ForbiddenApplicationException(
        'Clients are not allowed to create suggestions',
      );
    }
    return new BenefitSuggestionEntity(
      await this.benefitService.createBenefitSuggestion(user.id, dto, user),
    );
  }

  @Patch('suggestions/approveMany')
  @CheckAbilities({ action: Action.Update, subject: 'BenefitSuggestion' })
  async approveManyBenefitSuggestion(
    @Body() dto: DeleteApproveManySuggestionsDto,
    @AuthUser() user: User,
  ) {
    return await this.benefitService.approveManyBenefitSuggestions(dto, user);
  }

  @Patch('suggestions/:id')
  @CheckAbilities({ action: Action.Update, subject: 'BenefitSuggestion' })
  async editBenefitSuggestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditBenefitSuggestionDto,
    @AuthUser() user: User,
  ) {
    if (user.role === UserRole.Client) {
      throw new ForbiddenApplicationException(
        'Clients are not allowed to edit suggestions',
      );
    }
    return new BenefitSuggestionEntity(
      await this.benefitService.editBenefitSuggestion(id, dto),
    );
  }

  @Patch('suggestions/:id/approve')
  @CheckAbilities({ action: Action.Update, subject: 'BenefitSuggestion' })
  async approveBenefitSuggestion(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: User,
  ) {
    if (user.role === UserRole.Client) {
      throw new ForbiddenApplicationException(
        'Clients are not allowed to approve suggestions',
      );
    }
    return new BenefitSuggestionEntity(
      await this.benefitService.approveBenefitSuggestion(id, user),
    );
  }

  @Delete('suggestions/deleteMany')
  @CheckAbilities({ action: Action.Delete, subject: 'BenefitSuggestion' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteManyBenefitSuggestion(
    @Body() dto: DeleteApproveManySuggestionsDto,
    @AuthUser() user: User,
  ) {
    return this.benefitService.deleteManyBenefitSuggestions(dto, user);
  }

  @Delete('suggestions/:id')
  @CheckAbilities({ action: Action.Delete, subject: 'BenefitSuggestion' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBenefitSuggestion(@Param('id', ParseIntPipe) id: number) {
    return new BenefitSuggestionEntity(
      await this.benefitService.deleteBenefitSuggestion(id),
    );
  }

  @Post('suggestions/:id/upvote')
  upvoteBenefitSuggestion(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: User,
  ) {
    return this.benefitService.upvoteBenefitSuggestion(id, user.id);
  }

  @Post('suggestions/:id/downvote')
  downvoteBenefitSuggestion(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: User,
  ) {
    return this.benefitService.downvoteBenefitSuggestion(id, user.id);
  }
}
