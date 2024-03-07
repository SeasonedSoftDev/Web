import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AmbassadorService } from './ambassador.service';
import { AmbassadorRegistrationDto } from './dto';
import { UserPaginationResult } from '../users/utils/user-pagination-result';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { UserEntity } from '../users/entities/user.entity';
import { User } from '@prisma/client';
import { AuthUser, Public } from '../auth/decorators';
import { UserRole } from 'src/utils';
import { UpdateAmbassadorDto } from './dto/update-ambassador.dto';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { GetAmbassadorDto } from './dto/get-ambassador.dto';
import { AmbassadorAffiliatedEntity } from './entities/ambassador-affiliated.entity';
import { AmbassadorFilterDto } from './dto/ambassador-filter.dto';

@Controller('ambassador')
@ApiTags('ambassador')
export class AmbassadorController {
  constructor(private readonly ambassadorService: AmbassadorService) {}

  @Get('affiliateCodeOwner/:code')
  @Public()
  @ApiOperation({
    summary: 'Affiliate Owner',
    description: 'Get influencer that is the owner of the affiliate code',
  })
  @ApiOkResponse({
    description: 'Affiliate Influencer',
    type: AmbassadorAffiliatedEntity,
  })
  @HttpCode(HttpStatus.OK)
  async affiliateCodeOwner(@Param('code') code: string) {
    return await this.ambassadorService.affiliateCodeOwner(code);
  }

  @Post('registration')
  @Public()
  @ApiOperation({
    summary: 'Ambassador registration',
    description:
      'Allows only request with valid token in request query. Token can be obtained from an invitation link provided by the super-admin',
  })
  @ApiOkResponse({
    description: 'Account successfuly created.',
    type: UserEntity,
  })
  @HttpCode(HttpStatus.CREATED)
  register(
    @Query('token') token: string,
    @Body() dto: AmbassadorRegistrationDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.ambassadorService.register(token, dto, { language: i18n.lang });
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve multiple ambassadors',
    description:
      'Retrieves the ambassadors by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({ type: UserPaginationResult })
  @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() paginationParams: FilterParamsDto,
    @Query() AmbassadorFilterParamsDto: AmbassadorFilterDto,
  ) {
    return serializePaginationResult<User, UserEntity>(
      this.ambassadorService.findAll(
        paginationParams,
        AmbassadorFilterParamsDto,
      ),
      UserEntity,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve single ambassador',
    description: 'Retrieves the ambassador by his ID.',
  })
  @ApiOkResponse({ type: UserEntity })
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() dto: GetAmbassadorDto,
  ) {
    return new UserEntity(
      await this.ambassadorService.findOne(id, dto.includeAffiliates),
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Ambassador of userId',
    description: 'Only super-admin or ambassador can update his data.',
  })
  async updateOneById(
    @Param('id') id: number,
    @Body() dto: UpdateAmbassadorDto,
    @AuthUser() user: User,
  ) {
    if (
      (user.role !== UserRole.SuperAdmin &&
        user.role !== UserRole.Ambassador) ||
      (user.role === UserRole.Ambassador && user.id !== id)
    )
      throw new ForbiddenException();
    return new UserEntity(await this.ambassadorService.updateOneById(id, dto));
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete the ambassador',
    description: 'Flags the ambassador as deleted. All of his data remains.',
  })
  @ApiOkResponse({
    description: 'Ambassador is flagged as deleted',
    type: UserEntity,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UserEntity,
  ) {
    if (
      (user.role !== UserRole.SuperAdmin &&
        user.role !== UserRole.Ambassador) ||
      (user.role === UserRole.Ambassador && user.id !== id)
    )
      await this.ambassadorService.deleteOne(id);
  }
}
