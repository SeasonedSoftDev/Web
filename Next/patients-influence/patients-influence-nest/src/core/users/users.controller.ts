import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ParseIntPipe,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CheckAbilities } from '../../core/auth/ability/decorators/ability.decorator';
import { Action } from '../../core/auth/ability';
import { UserEntity } from './entities/user.entity';
import { Gender } from './enums/gender';
import { EnumItemResult } from 'src/utils/object-definitions/results/enum-item-result';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { serializeEnum } from 'src/utils/serializers/enum-result.serializer';
import { Response } from 'express';
import { ContactAdminsDto } from './dto/contact-admins.dto';
import { AuthUser } from '../auth/decorators';
import { UpdateUsersStatusDto } from './dto/update-users-status.dto';
import { UserRole, UserStatus } from 'src/utils';
import { DeleteManyUsersDto } from './dto/delete-many-users.dto';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('genders')
  @ApiOperation({
    summary: 'Get genders',
    description: 'Retrieves available genders (assignee type enum/property).',
  })
  @ApiOkResponse({ type: EnumItemResult, isArray: true })
  @ApiTags('enums and types')
  @NoAutoSerialize()
  getAvailableSurveyTypes(@Res() res: Response) {
    return res.json(serializeEnum(Gender));
  }

  @Get('userStatus')
  // ?
  /* @CheckAbilities(
    { action: Action.Read, subject: 'Stakeholder' },
    { action: Action.Read, subject: 'Influencer' },
  ) */
  @ApiOperation({
    summary: 'Get user statuses',
    description: 'Retrieves user statuses (type enum/property).',
  })
  @ApiOkResponse({ type: EnumItemResult, isArray: true })
  @ApiTags('enums and types')
  @NoAutoSerialize()
  getAvailableUserTypes(@Res() res: Response) {
    return res.json(serializeEnum(UserStatus));
  }

  @Post('contactAdmins')
  contactAdmins(@Body() dto: ContactAdminsDto, @AuthUser() user: UserEntity) {
    return this.usersService.contactAdmins(dto, user);
  }

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'User' })
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'User' })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @NoAutoSerialize()
  findAll(@Query() filterParamsDto: FilterParamsDto) {
    return serializePaginationResult(
      this.usersService.findAll(filterParamsDto),
      UserEntity,
    );
  }

  /* @Get('single')
  @CheckAbilities({ action: Action.Read, subject: 'User' })
  findOne(@Query() properties: User) {
    return this.usersService.findOne(properties);
  } */

  @Get(':id')
  @ApiOperation({
    summary: 'Get the user by ID',
    description: 'Retrieves the first user that matches given ID',
  })
  @CheckAbilities({ action: Action.Read, subject: 'User' })
  @ApiOkResponse({ type: UserEntity })
  findOneById(@Param('id') id: string) {
    return this.usersService.findOneById(+id);
  }

  @Patch('/status')
  @ApiOperation({
    summary: 'Update selected users statuses',
    description: 'Updates selected users statuses',
  })
  @CheckAbilities({ action: Action.Update, subject: 'User' })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  updateUsersStatus(
    @Body() updateDto: UpdateUsersStatusDto,
    @AuthUser() user: UserEntity,
  ) {
    if (user.role !== UserRole.SuperAdmin) throw new UnauthorizedException();

    return this.usersService.updateUsersStatus(updateDto);
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
    @Body() dto: DeleteManyUsersDto,
    @AuthUser() user: UserEntity,
  ) {
    if (user.role !== UserRole.SuperAdmin) throw new UnauthorizedException();
    return this.usersService.deleteMany(dto);
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
  async deleteOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UserEntity,
  ) {
    if (user.role !== UserRole.SuperAdmin) throw new UnauthorizedException();
    return new UserEntity(await this.usersService.deleteOne(id));
  }

  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: 'User' })
  @ApiOkResponse({ type: UserEntity })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: 'User' })
  @ApiOkResponse({ type: UserEntity })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
