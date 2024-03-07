import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { IndustryService } from './industry.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { Throttle } from '@nestjs/throttler';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { IndustryPaginationEntity } from './entities/industry-pagination.entity';
import { IndustryEntity } from './entities/industry.entity';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';

@Controller('industries')
@ApiTags('industry', 'dropdown options')
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  @Post()
  create(@Body() createIndustryDto: CreateIndustryDto) {
    return this.industryService.create(createIndustryDto);
  }

  @Get()
  // @Throttle(50, 60)
  // @Throttle(100, 60)
  @ApiOperation({
    summary: 'Get industry/es (filter)',
    description:
      'Retrieves the industry/es by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    type: IndustryPaginationEntity,
  })
  findAll(@Query() filterParamsDto: FilterParamsDto) {
    return serializePaginationResult(
      this.industryService.findAll(filterParamsDto),
      IndustryEntity,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.industryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIndustryDto: UpdateIndustryDto,
  ) {
    return this.industryService.update(+id, updateIndustryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.industryService.remove(+id);
  }
}
