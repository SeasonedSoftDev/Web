import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import {
  InfluencerRegistrationDto,
  InfluencerRegistrationViaInvitationDto,
} from './dto';
import { InfluencerService } from './influencer.service';
import { Public } from '../auth/decorators/public.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { UserPaginationResult } from '../users/utils/user-pagination-result';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { PaginationParamsDto } from 'src/utils/object-definitions/dtos/pagination-params.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';
import { Action } from '../auth/ability';
import { CheckAbilities } from '../auth/ability/decorators/ability.decorator';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/utils';
import { AuthUser } from '../auth/decorators';
import { SendEmailDto } from './dto/send-email.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { DiscoverInfluencersFilterDto } from './dto/filters/discover-influencers-filter.dto';
import { InfluencersFilterDto } from './dto/filters/influencers-filter.dto';
import { GetInfluencerDto } from './dto/get-influencer.dto';
import { InfluencerAffiliatedEntity } from './entities/influencer-affiliated.entity';
import { DeleteManyInfluencersDto } from './dto/delete-many-influencers.dto';
import { FindByIdsDto } from '../finance/dto/find-by-ids.dto';
import { FilterParamsDto as FilterParamsObjectDefDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { FilterSearchInfluencersDto } from './dto/filters/filter-search-influencers.dto';

@Controller('influencer')
@ApiTags('influencer')
export class InfluencerController {
  constructor(private readonly influencerService: InfluencerService) {}

  @Get('exportInfluencers')
  async exportInfluencers(@Query() dto: FindByIdsDto) {
    return this.influencerService.exportInfluencers(dto);
  }

  @Get('exportDiscoverInfluencers')
  async exportDiscoverInfluencers(@Query() dto: FindByIdsDto) {
    return this.influencerService.exportDiscoverInfluencers(dto);
  }

  @Get('affiliateCodeOwner/:code')
  @Public()
  @ApiOperation({
    summary: 'Affiliate Owner',
    description: 'Get influencer that is the owner of the affiliate code',
  })
  @ApiOkResponse({
    description: 'Affiliate Influencer',
    type: InfluencerAffiliatedEntity,
  })
  @HttpCode(HttpStatus.OK)
  async affiliateCodeOwner(@Param('code') code: string) {
    return await this.influencerService.affiliateCodeOwner(code);
  }

  @Post('registration')
  @Public()
  @ApiOperation({
    summary: 'Influencer registration',
    description: 'Create influencer account via register form',
  })
  @ApiOkResponse({
    description: 'Influencer registered on his own behalf',
    type: UserEntity,
  })
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: InfluencerRegistrationDto, @I18n() i18n: I18nContext) {
    return this.influencerService.register(dto, { language: i18n.lang });
  }

  @Post('registrationViaInvitation')
  @Public()
  @ApiOperation({
    summary: 'Influencer registration via invite link',
    description: 'Create influencer account via invitation link',
  })
  @ApiOkResponse({
    description: 'Influencer registered by an invitation',
    type: UserEntity,
  })
  @HttpCode(HttpStatus.CREATED)
  registerViaInvitation(@Body() dto: InfluencerRegistrationViaInvitationDto) {
    return this.influencerService.registerViaInvitation(dto);
  }

  // contact via email
  @Post(':id/sendEmail')
  @CheckAbilities({ action: Action.Manage, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Send an email',
    description: 'Sends and email to the selected influencer.',
  })
  async sendEmail(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SendEmailDto,
  ) {
    return await this.influencerService.sendEmail(id, dto);
  }

  // * OLD BUT WORKING!
  /* @Get()
  @ApiOperation({
    summary: 'Retrieve multiple influencers',
    description:
      'Retrieves the influencers by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({ type: UserPaginationResult })
  @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() paginationParamsDto: PaginationParamsDto,
    @Query() filterParamsDto: FilterParamsDto,
  ) {
    return serializePaginationResult<User, UserEntity>(
      this.influencerService.findAll(paginationParamsDto, filterParamsDto),
      UserEntity,
    );
  } */
  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Retrieve multiple influencers',
    description:
      'Retrieves the influencers by filtering them, sorting and doing all kinds of other operations.',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserPaginationResult })
  @NoAutoSerialize()
  filterInfluencers(
    @Query() paginationParamsDto: PaginationParamsDto,
    @Query() filterParamsDto: InfluencersFilterDto,
  ) {
    return this.influencerService.filterInfluencers(
      paginationParamsDto,
      filterParamsDto,
    );
  }

  @Get('searchInfluencers')
  @ApiOperation({
    summary: 'Get users that are influencers (filter)',
    description:
      'Retrieves the influencers by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    type: UserPaginationResult,
  })
  @NoAutoSerialize()
  searchInfluencers(
    @Query() filterParamsDto: FilterParamsObjectDefDto,
    @Query() filterSearchInfluencerCase: FilterSearchInfluencersDto,
  ) {
    return this.influencerService.findAllInfluencers(
      filterParamsDto,
      filterSearchInfluencerCase,
    );
  }

  @Get('discoverInfluencers')
  @CheckAbilities({ action: Action.Read, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Retrieve discover influencers',
  })
  // @ApiOkResponse({ type: UserPaginationResult })
  // @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  filterDiscoverInfluencers(
    @Query() paginationParamsDto: PaginationParamsDto,
    @Query() filterParamsDto: DiscoverInfluencersFilterDto,
  ) {
    return this.influencerService.filterDiscoverInfluencers(
      paginationParamsDto,
      filterParamsDto,
    );
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Retrieve single influencer',
    description: 'Retrieves the influencer by his ID.',
  })
  @ApiOkResponse({ type: UserEntity })
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() dto: GetInfluencerDto,
  ) {
    return new UserEntity(
      await this.influencerService.findOne(
        id,
        dto.includeDetailedInfo,
        dto.includeAffiliates,
      ),
    );
  }

  @Patch('/deleteSelectedUsers')
  @CheckAbilities({ action: Action.Update, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Delete the list of influencers',
    description:
      'Flags the list of influencers as deleted. All of their data remains.',
  })
  @ApiOkResponse({
    description: 'Influencers are flagged as deleted',
    type: UserEntity,
  })
  async deleteMany(
    @Body() dto: DeleteManyInfluencersDto,
    @AuthUser() user: UserEntity,
  ) {
    if (user.role !== UserRole.SuperAdmin) throw new UnauthorizedException();
    return this.influencerService.deleteMany(dto);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Delete the influencer',
    description: 'Flags the influencer as deleted. All of his data remains.',
  })
  @ApiOkResponse({
    description: 'Influencer is flagged as deleted',
    type: UserEntity,
  })
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.influencerService.deleteOne(id));
  }

  @Patch(':id/verify')
  @CheckAbilities({ action: Action.Manage, subject: 'Influencer' })
  async verifyInfluencer(
    @Param('id') id: number,
    @AuthUser() user: UserEntity,
  ) {
    if (user.role !== UserRole.SuperAdmin) throw new UnauthorizedException();

    return new UserEntity(await this.influencerService.verifyByUserId(id));
  }

  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Update an influencer',
    description:
      'This endpoint allows you to update the information of an influencer in the system. You need to provide the ID of the influencer you want to edit, along with the new data that you want to replace the existing information with.',
  })
  @ApiOkResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInfluencerDto,
  ) {
    return new UserEntity(await this.influencerService.update(id, dto));
  }
}
