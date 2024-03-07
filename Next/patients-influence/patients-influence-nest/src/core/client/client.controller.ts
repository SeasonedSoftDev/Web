import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Query,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
  Put,
} from '@nestjs/common';
import { ClientService } from './client.service';
import {
  ClientProductsDto,
  ClientRegistrationDto,
  ClientRegistrationViaInvitationDto,
} from './dto';
import { Public } from '../../core/auth/decorators/public.decorator';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../users/entities/user.entity';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { UserPaginationResult } from '../users/utils/user-pagination-result';
import { CheckAbilities } from '../auth/ability/decorators/ability.decorator';
import { Action } from '../auth/ability';
import { SendEmailDto } from '../influencer/dto/send-email.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { PaginationParamsDto } from 'src/utils/object-definitions/dtos/pagination-params.dto';
import { DiscoverClientsFilterDto } from './dto/filters/discover-clients-filter.dto';
import { ClientsFilterDto } from './dto/filters/clients-filter.dto';
import { CreateDiscoverClientDto } from './dto/create-discover-client.dto';
import { AuthUser } from '../auth/decorators';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateDiscoverClientDto } from './dto/update-discover-client.dto';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { DiseaseAreaEntity } from '../common/disease-area/entities/disease-area.entity';
import { serializeArray } from 'src/utils/serializers/array.serializer';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { ClientProduct, DiseaseArea, User } from '@prisma/client';
import { ClientProductEntity } from './entities';
import { FindByIdsDto } from '../finance/dto/find-by-ids.dto';
// import { Throttle } from '@nestjs/throttler';

@Controller('client')
@ApiTags('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('export')
  async exportClients(@Query() dto: FindByIdsDto) {
    return this.clientService.exportClients(dto);
  }

  @Get('exportDiscoverClients')
  async exportDiscoverClients(@Query() dto: FindByIdsDto) {
    return this.clientService.exportDiscoverClients(dto);
  }

  @Get()
  // @Throttle(50, 60)
  // @Throttle(100, 60)
  @CheckAbilities({ action: Action.Read, subject: 'User' })
  @ApiOperation({
    summary: 'Get users that are clients (filter)',
    description:
      'Retrieves the clients by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    type: UserPaginationResult,
  })
  @NoAutoSerialize()
  findAll(@Query() filterParamsDto: FilterParamsDto) {
    return serializePaginationResult(
      this.clientService.findAllClients(filterParamsDto),
      UserEntity,
    );
  }

  @Get('affiliateCodeOwner/:code')
  @Public()
  async affiliateCodeOwner(@Param('code') code: string) {
    return await this.clientService.affiliateCodeOwner(code);
  }

  @Post('discoverClients')
  @CheckAbilities({ action: Action.Create, subject: 'DiscoverClient' })
  @ApiOperation({
    summary: 'Add discover client',
    description: 'Adds discover client',
  })
  /* @ApiCreatedResponse({
    type: UserEntity,
  }) */
  @HttpCode(HttpStatus.CREATED)
  async discoverClient(
    @Body() dto: CreateDiscoverClientDto,
    @AuthUser() user: User,
  ) {
    return new UserEntity(
      await this.clientService.createDiscoverClient(dto, user),
    );
  }

  @Put('discoverClients/:discoverClientId/invite')
  @CheckAbilities(
    { action: Action.Manage, subject: 'Client' },
    { action: Action.Manage, subject: 'DiscoverClient' },
  )
  @ApiOperation({
    summary: 'Invite a client',
    description: 'Sends an email to the potential client.',
  })
  async inviteClient(
    @Param('discoverClientId', ParseIntPipe) discoverClientId: number,
    @Body() dto: SendEmailDto,
  ) {
    return await this.clientService.inviteClient(discoverClientId, dto);
  }

  @Post('registration')
  @ApiOperation({
    summary: 'Register a client',
    description: 'Create the client account on his behalf',
  })
  /* @ApiCreatedResponse({
    type: UserEntity,
  }) */
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async register(
    @Body() dto: ClientRegistrationDto,
    @I18n() i18n: I18nContext,
  ) {
    return new UserEntity(
      await this.clientService.register(dto, undefined, {
        language: i18n.lang,
      }),
    );
  }

  @Post('registrationViaInvitation')
  @ApiOperation({
    summary: 'Register a client via invite link',
    description: 'Create the client account via invitation link',
  })
  /* @ApiCreatedResponse({
    type: UserEntity,
  }) */
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async registerViaInvitation(
    @Body() dto: ClientRegistrationViaInvitationDto,
    @I18n() i18n: I18nContext,
  ) {
    // return new UserEntity(await this.clientService.registerViaInvitation(dto));
    return await this.clientService.registerViaInvitation(dto, {
      language: i18n.lang,
    });
  }

  // contact via email
  @Post(':id/sendEmail')
  @CheckAbilities({ action: Action.Manage, subject: 'Client' })
  @ApiOperation({
    summary: 'Send an email',
    description: 'Sends and email to the selected client.',
  })
  async sendEmail(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SendEmailDto,
  ) {
    return await this.clientService.sendEmail(id, dto);
  }

  // @Get()
  // @ApiOperation({
  //   summary: 'Retrieve multiple clients',
  //   description:
  //     'Retrieves the clients by filtering them, sorting and doing all kinds of other operations.',
  // })
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: UserPaginationResult })
  // @NoAutoSerialize()
  // findAll(@Query() dto: ClientsQueryParamsDto) {
  //   // return serializePaginationResult<User, UserEntity>(
  //   //   this.clientService.findAll(), // ! removed filterParams because it breaks as there is no param in findAll()!!!
  //   //   UserEntity,
  //   // );
  //   return this.clientService.findAll(dto);
  // }
  @Get('table')
  @CheckAbilities({ action: Action.Read, subject: 'Client' })
  @ApiOperation({
    summary: 'Retrieve multiple clients',
    description:
      'Retrieves the clients by filtering them, sorting and doing all kinds of other operations.',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserPaginationResult })
  @NoAutoSerialize()
  filterClients(
    @Query() paginationParamsDto: PaginationParamsDto,
    @Query() filterParamsDto: ClientsFilterDto,
  ) {
    return this.clientService.findAll(paginationParamsDto, filterParamsDto);
  }

  @Get('discoverClients')
  @CheckAbilities({ action: Action.Read, subject: 'DiscoverClient' })
  @ApiOperation({
    summary: 'Retrieve discover clients',
  })
  // @ApiOkResponse({ type: UserPaginationResult })
  // @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  filterDiscoverClients(
    @Query() paginationParamsDto: PaginationParamsDto,
    @Query() filterParamsDto: DiscoverClientsFilterDto,
  ) {
    return this.clientService.filterDiscoverClients(
      paginationParamsDto,
      filterParamsDto,
    );
  }

  @Get('diseaseAreas')
  @ApiOperation({
    summary: 'Retrieve a clients Client Disease Areas',
  })
  @CheckAbilities({ action: Action.Read, subject: 'ClientDiseaseArea' })
  @ApiOkResponse({ type: DiseaseAreaEntity, isArray: true })
  @HttpCode(HttpStatus.OK)
  @NoAutoSerialize()
  async findClientDiseaseAreas(@AuthUser() user: UserEntity) {
    return serializeArray<DiseaseArea, DiseaseAreaEntity>(
      this.clientService.findClientDiseaseAreas(user),
      DiseaseAreaEntity,
    );
  }

  @Get('recommendedDiseaseAreas')
  @ApiOperation({
    summary: 'Retrieve a clients recommended Client Disease Areas',
  })
  @CheckAbilities({ action: Action.Read, subject: 'ClientDiseaseArea' })
  @ApiOkResponse({ type: DiseaseAreaEntity, isArray: true })
  @HttpCode(HttpStatus.OK)
  @NoAutoSerialize()
  async findRecommendedDiseaseAreas(@AuthUser() user: UserEntity) {
    return serializeArray<DiseaseArea, DiseaseAreaEntity>(
      this.clientService.findRecommendedClientDiseaseAreas(user),
      DiseaseAreaEntity,
    );
  }

  @Get('products')
  @ApiOperation({
    summary: 'Retrieve a clients ClientProducts',
  })
  @CheckAbilities({ action: Action.Read, subject: 'ClientProduct' })
  @ApiOkResponse({ type: ClientProductEntity, isArray: true })
  @HttpCode(HttpStatus.OK)
  @NoAutoSerialize()
  findClientProducts(
    @AuthUser() user: UserEntity,
    @Query() filterParams: FilterParamsDto,
  ) {
    return serializePaginationResult<ClientProduct, ClientProductEntity>(
      this.clientService.findClientProducts(user, filterParams),
      ClientProductEntity,
    );
  }

  @Post('products')
  @ApiOperation({
    summary: 'Manage a clients ClientProducts',
    description:
      'Takes in ClientProductsDto with property of clientProducts: ClientProductDto[] specifying the new state!',
  })
  @CheckAbilities({ action: Action.Manage, subject: 'ClientProduct' })
  @ApiOkResponse({ type: ClientProductEntity, isArray: true })
  @HttpCode(HttpStatus.OK)
  @NoAutoSerialize()
  setClientProducts(
    @AuthUser() user: UserEntity,
    @Body() body: ClientProductsDto,
  ) {
    return serializeArray<ClientProduct, ClientProductEntity>(
      this.clientService.setClientProducts(user, body),
      ClientProductEntity,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a client by userId',
  })
  @CheckAbilities({ action: Action.Read, subject: 'Client' })
  @ApiOkResponse({ type: UserEntity })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.clientService.findOne(id));
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: 'Client' })
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    this.clientService.deleteOne(id);
  }

  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: 'Client' })
  @ApiOperation({
    summary: 'Update a client',
    description:
      'This endpoint allows you to update the information of a client in the system. You need to provide the ID of the client you want to edit, along with the new data that you want to replace the existing information with.',
  })
  @ApiOkResponse({ type: UserEntity })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateClientDto,
    @AuthUser() user: User,
  ) {
    return new UserEntity(await this.clientService.updateClient(id, dto, user));
  }

  @Patch('discoverClients/:discoverClientId')
  @CheckAbilities({ action: Action.Update, subject: 'DiscoverClient' })
  @ApiOperation({
    summary: 'Update a discover client',
    description:
      'This endpoint allows you to update the information of a discover client in the system. You need to provide the ID of the discover client you want to edit, along with the new data that you want to replace the existing information with.',
  })
  @ApiOkResponse({ type: UserEntity })
  async updateDiscoverClient(
    @Param('discoverClientId', ParseIntPipe) id: number,
    @Body() dto: UpdateDiscoverClientDto,
    @AuthUser() user: User,
  ) {
    return new UserEntity(
      await this.clientService.updateDiscoverClient(id, dto, user),
    );
  }
}
