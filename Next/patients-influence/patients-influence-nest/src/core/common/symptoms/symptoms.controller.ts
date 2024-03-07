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
import { SymptomsService } from './symptoms.service';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { SymptomEntity } from './entities/symptom.entity';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
// import { Throttle } from '@nestjs/throttler';
import { SymptomPaginationEntity } from './entities/symptom-pagination.entity';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';

@Controller('symptoms')
@ApiTags('symptoms', 'dropdown options')
export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) {}

  @Post()
  create(@Body() createSymptomDto: CreateSymptomDto) {
    return this.symptomsService.create(createSymptomDto);
  }

  @Get()
  // @Throttle(50, 60)
  // @Throttle(100, 60)
  // @CheckAbilities({ action: Action.Read, subject: 'SymptomOption' })
  @ApiOperation({
    summary: 'Get symptom/symptoms (filter)',
    description:
      'Retrieves the symptoms by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    description: 'Symptom/symptoms retrieved',
    type: SymptomPaginationEntity,
  })
  @NoAutoSerialize()
  findAll(@Query() filterParamsDto: FilterParamsDto) {
    return serializePaginationResult(
      this.symptomsService.findAll(filterParamsDto),
      SymptomEntity,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.symptomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSymptomDto: UpdateSymptomDto) {
    return this.symptomsService.update(+id, updateSymptomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.symptomsService.remove(+id);
  }
}
