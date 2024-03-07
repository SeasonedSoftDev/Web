import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { SMLService } from './sml.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from '../auth/decorators';
import { SocialMediaListening, User } from '@prisma/client';
import { UserEntity } from '../users/entities/user.entity';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { StakeholderPostEntity } from './entities/stakeholder-post.entity';
import { CreateSMLDto, SmlPostsFilterDto, UpdateSMLDto } from './dto';
import { SmlEntity } from './entities';
import { UserRole } from 'src/utils';
import { SMLFilterDto } from './dto/sml-filter.dto';
import { CheckAbilities } from '../auth/ability/decorators/ability.decorator';
import { Action } from '../auth/ability';
import { EnumItemResult } from 'src/utils/object-definitions/results/enum-item-result';
import { Response } from 'express';
import { CreditPackage } from './enums/credit-package.enum';
import { serializeEnum } from 'src/utils/serializers/enum-result.serializer';
import { cacheKeys } from 'src/config';
import { CacheInvalidate } from 'src/decorators/cache-invalidate.decorator';
import { DeleteManySMLsDto } from './dto/delete-many-smls.dto';
import { FindByIdsDto } from '../finance/dto/find-by-ids.dto';

@ApiTags('sml')
@Controller('sml')
export class SMLController {
  private static readonly cacheInvalidateOnSMLCreate = [
    cacheKeys.insightClientSMLs, // count smls
  ];
  private static readonly cacheInvalidateOnSMLUpdate =
    SMLController.cacheInvalidateOnSMLCreate;
  private static readonly cacheInvalidateOnSMLDelete =
    SMLController.cacheInvalidateOnSMLCreate;

  constructor(private readonly smlService: SMLService) {}

  @Get('exports')
  async exports(@Query() dto: FindByIdsDto, @AuthUser() user: User) {
    return this.smlService.exportSMLs(dto, user);
  }

  @Get('creditPackages')
  @ApiOperation({
    summary: 'Get credit packages',
    description:
      'Retrieves available credit packages (credit package enum/property).',
  })
  @ApiOkResponse({ type: EnumItemResult, isArray: true })
  @ApiTags('enums and types')
  @NoAutoSerialize()
  getAvailableCreditPackages(@Res() res: Response) {
    return res.json(serializeEnum(CreditPackage));
  }

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'SML' })
  @ApiOperation({
    summary: 'Creates a new Social Media Listening',
    description: 'Creates a new sml takes in CreateSMLDto',
  })
  @ApiBody({ type: CreateSMLDto, isArray: false })
  @ApiCreatedResponse({ type: SmlEntity, isArray: false })
  @HttpCode(HttpStatus.CREATED)
  @CacheInvalidate(...SMLController.cacheInvalidateOnSMLCreate)
  async create(@Body() createSmlDto: CreateSMLDto, @AuthUser() user: User) {
    return new SmlEntity(await this.smlService.createSml(createSmlDto, user));
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'SML' })
  @ApiOperation({
    summary: 'Gets SMLs by filter params',
    description: 'Queries SMLs by FilterParams',
  })
  @ApiOkResponse({
    type: SmlEntity,
    isArray: true,
  })
  @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() filterParamsDto: FilterParamsDto,
    @Query() filters: SMLFilterDto,
    @AuthUser() user: UserEntity,
  ) {
    if (user.role === UserRole.Ambassador || user.role === UserRole.Influencer)
      throw new UnauthorizedException();

    return serializePaginationResult<SocialMediaListening, SmlEntity>(
      this.smlService.findAll(filterParamsDto, filters, user),
      SmlEntity,
    );
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: 'SML' })
  @ApiOperation({
    summary: 'Gets an SML by ID',
    description: 'Gets a single SML',
  })
  @ApiOkResponse({
    type: SmlEntity,
    isArray: false,
  })
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: number, @AuthUser() user: UserEntity) {
    if (user.role === UserRole.Ambassador || user.role === UserRole.Influencer)
      throw new UnauthorizedException();
    return new SmlEntity(await this.smlService.findOneById(id, user));
  }

  @Post(':id/posts')
  @ApiOperation({
    description:
      "Get's posts for provided SML ID and filters by SmlPostsFilterDto",
  })
  @ApiBody({ type: SmlPostsFilterDto })
  @ApiOkResponse({ type: StakeholderPostEntity })
  @HttpCode(HttpStatus.OK)
  findPostsBySMLId(
    @Param('id') id: number,
    @Query() filterParams: FilterParamsDto,
    @Body() filters: SmlPostsFilterDto,
    @AuthUser() user: UserEntity,
  ) {
    if (user.role === UserRole.Ambassador || user.role === UserRole.Influencer)
      throw new UnauthorizedException();
    return this.smlService.findPostsBySMLId(id, user, filters, filterParams);
  }

  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: 'SML' })
  @ApiOperation({ description: 'Updates SML of SML ID' })
  @ApiBody({ type: UpdateSMLDto })
  @ApiOkResponse({ type: SmlEntity })
  @HttpCode(HttpStatus.OK)
  @CacheInvalidate(...SMLController.cacheInvalidateOnSMLUpdate)
  async updateById(
    @Param('id') id: number,
    @Body() updateSmlDto: UpdateSMLDto,
    @AuthUser() user: UserEntity,
  ) {
    if (UserRole.SuperAdmin !== user.role && UserRole.Admin !== user.role) {
      throw new UnauthorizedException();
    }
    return new SmlEntity(await this.smlService.updateById(id, updateSmlDto));
  }

  @Delete('/deleteSelectedSMLs')
  @CheckAbilities({ action: Action.Update, subject: 'SML' })
  @ApiOperation({
    summary: 'Delete the list of campaigns',
    description:
      'Removes the selected list of campaigns from the database. This action is irreversible.',
  })
  @ApiOkResponse({
    description: 'Campaigns are removed from the database',
    type: SmlEntity,
  })
  @CacheInvalidate(...SMLController.cacheInvalidateOnSMLDelete)
  async deleteMany(
    @Body() dto: DeleteManySMLsDto,
    @AuthUser() user: UserEntity,
  ) {
    if (user.role !== UserRole.SuperAdmin && user.role !== UserRole.Admin)
      throw new UnauthorizedException();
    return this.smlService.deleteMany(dto);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: 'SML' })
  @HttpCode(HttpStatus.OK)
  @CacheInvalidate(...SMLController.cacheInvalidateOnSMLDelete)
  async deleteById(@Param('id') id: number, @AuthUser() user: UserEntity) {
    if (user.role === UserRole.Ambassador || user.role === UserRole.Influencer)
      throw new UnauthorizedException();
    return this.smlService.deleteById(id, user);
  }
}
