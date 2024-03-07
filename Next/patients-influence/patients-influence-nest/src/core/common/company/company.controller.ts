import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyTitleService } from './company-title.service';
import { CreateCompanyDto, CreateCompanyTitleDto } from './dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyEntity } from './entities/company.entity';
import { CompanyPaginationEntity } from './entities/company-pagination.entity';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { PaginationParamsDto } from 'src/utils/object-definitions/dtos/pagination-params.dto';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { Company, CompanyTitle, User } from '@prisma/client';
import { CompanyTitleEntity } from './entities/company-title.entity';
import { CompanyTitlePaginationEntity } from './entities/company-title-pagination.entity';
import { Action } from 'src/core/auth/ability';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { BatchPayloadEntity } from 'src/utils/entities/batch-payload.entity';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { CompanyFilterParamsDto } from './dto/query/company-filter-params.dto';
import { AuthUser, Public } from 'src/core/auth/decorators';
import { UpdateCompanyDto } from './dto/update-company.dto';
// import { Throttle } from '@nestjs/throttler';

@Controller('companies')
@ApiTags('company', 'dropdown options')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly companyTitleService: CompanyTitleService,
  ) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'Company' })
  @ApiOperation({
    summary: 'Create company/companies',
    description:
      'Creates a company and puts it in a state for admin approval, eg. super admin approval. When super admin creates the company, it instantly becomes approved.',
  })
  @ApiBody({ type: CreateCompanyDto, isArray: true })
  @ApiCreatedResponse({
    description: 'Company/companies created',
    type: BatchPayloadEntity,
  })
  createCompanies(@Body() dto: CreateCompanyDto[], @AuthUser() user: User) {
    return this.companyService.createCompanies(dto, user);
  }

  @Get('title')
  @Public()
  // @Throttle(50, 60)
  // @Throttle(100, 60)
  // @CheckAbilities({ action: Action.Read, subject: 'Company' })
  @ApiOperation({
    summary: 'Get company title/s (filter)',
    description:
      'Retrieves the company title/s by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    description: 'Company titles retrieved',
    type: CompanyTitlePaginationEntity,
  })
  @NoAutoSerialize()
  findAllCompanyTitles(@Query() filterParamsDto: FilterParamsDto) {
    return serializePaginationResult(
      this.companyTitleService.findAll(filterParamsDto),
      CompanyTitleEntity,
    );
  }

  @Get(':id')
  // @CheckAbilities({ action: Action.Read, subject: 'Company' })
  @Public()
  @ApiOperation({
    summary: 'Get single company',
  })
  @ApiOkResponse({
    description: 'Company retrieved',
    type: CompanyEntity,
  })
  async findOneCompanyById(@Param('id', ParseIntPipe) id: number) {
    return new CompanyEntity(await this.companyService.findOneById(id));
  }

  @Get()
  @Public()
  // @Throttle(50, 60)
  // @Throttle(100, 60)
  // @CheckAbilities({ action: Action.Read, subject: 'Company' })
  @ApiOperation({
    summary: 'Get company/companies (filter)',
    description:
      'Retrieves the companies by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    description: 'Company/companies retrieved',
    type: CompanyPaginationEntity,
  })
  @NoAutoSerialize()
  async findAllCompanies(
    @Query() filterParamsDto: FilterParamsDto,
    @Query() companyFilterParamsDto: CompanyFilterParamsDto,
  ) {
    return serializePaginationResult(
      this.companyService.findAll(filterParamsDto, companyFilterParamsDto),
      CompanyEntity,
    );
  }

  @Post('/title')
  @CheckAbilities({ action: Action.Create, subject: 'Company' })
  @ApiOperation({
    summary: 'Create company title/s',
  })
  @ApiBody({
    type: CreateCompanyTitleDto,
    isArray: true,
  })
  @ApiCreatedResponse({
    description: 'Company title/s created',
    type: BatchPayloadEntity,
  })
  createCompanyTitles(@Body() dto: CreateCompanyTitleDto[]) {
    return this.companyTitleService.createCompanyTitles(dto);
  }

  @Get('/title/:id')
  // @CheckAbilities({ action: Action.Read, subject: 'Company' })
  @Public()
  @ApiOperation({
    summary: 'Get single company title',
  })
  @ApiOkResponse({
    description: 'Company title retrieved',
    type: CompanyTitleEntity,
  })
  async findOneCompanyTitleById(@Param('id', ParseIntPipe) id: number) {
    return new CompanyTitleEntity(
      await this.companyTitleService.findOneById(id),
    );
  }

  //#region DELETE company title
  @Delete('title/:id')
  @CheckAbilities({ action: Action.Delete, subject: 'Company' })
  @ApiOperation({
    summary: 'Delete single company title',
  })
  @ApiOkResponse({
    description: 'Company title deleted',
    type: CompanyTitleEntity,
  })
  async deleteOneTitle(@Param('id', ParseIntPipe) id: number) {
    return new CompanyTitleEntity(await this.companyTitleService.deleteOne(id));
  }

  @Delete('title')
  @CheckAbilities({ action: Action.Delete, subject: 'Company' })
  @ApiOperation({
    summary: 'Delete multiple company titles',
  })
  @ApiBody({
    description: 'Label IDs',
    type: Number,
    isArray: true,
  })
  @ApiOkResponse({
    description: 'Company titles deleted',
    type: BatchPayloadEntity,
  })
  deleteManyTitles(@Body() ids: number[]) {
    return this.companyTitleService.deleteMany(ids);
  }
  //#endregion

  //#region UPDATE company & change statuses
  @Put(':id')
  @CheckAbilities({ action: Action.Update, subject: 'Company' })
  @ApiOperation({
    summary: 'Update a company',
  })
  @ApiBody({
    type: UpdateCompanyDto,
  })
  @ApiOkResponse({
    description: 'Company updated',
    type: CompanyEntity,
  })
  async updateCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyDto,
  ) {
    return new CompanyEntity(await this.companyService.updateOne(id, dto));
  }

  @Put(':id/approve')
  @CheckAbilities({ action: Action.Update, subject: 'Company' })
  @ApiOperation({
    summary: 'Approve a company',
    description:
      'Makes a company public. If someone entered non-existing company within the platform, it is not public until super admin approves.',
  })
  @ApiOkResponse({
    description: 'Company approved',
    type: CompanyEntity,
  })
  async approveCompany(@Param('id', ParseIntPipe) id: number) {
    return new CompanyEntity(
      await this.companyService.updateOne(id, { isApproved: true }),
    );
  }

  @Put(':id/disapprove')
  @CheckAbilities({ action: Action.Update, subject: 'Company' })
  @ApiOperation({
    summary: 'Disapprove a company',
    description: 'Makes a company non-public.',
  })
  @ApiOkResponse({
    description: 'Company disapproved',
    type: CompanyEntity,
  })
  async disapproveCompany(@Param('id', ParseIntPipe) id: number) {
    return new CompanyEntity(
      await this.companyService.updateOne(id, { isApproved: false }),
    );
  }
  //#endregion

  //#region DELETE company
  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: 'Company' })
  @ApiOperation({
    summary: 'Delete single company',
  })
  @ApiOkResponse({
    description: 'Company deleted',
    type: CompanyEntity,
  })
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return new CompanyEntity(await this.companyService.deleteOne(id));
  }

  @Delete()
  @CheckAbilities({ action: Action.Delete, subject: 'Company' })
  @ApiOperation({
    summary: 'Delete multiple companies',
  })
  @ApiBody({
    description: 'Label IDs',
    type: Number,
    isArray: true,
  })
  @ApiOkResponse({
    description: 'Company/companies deleted',
    type: BatchPayloadEntity,
  })
  deleteMany(@Body() ids: number[]) {
    return this.companyService.deleteMany(ids);
  }
  //#endregion
}
