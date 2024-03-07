import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DiseaseAreaService } from './disease-area.service';
import { DiseaseAreaDto } from './dto/disease-area.dto';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { DiseaseAreaPaginationEntity } from './entities/disease-area-pagination.entity';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { DiseaseAreaEntity } from './entities/disease-area.entity';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { Action } from 'src/core/auth/ability';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { BatchPayloadEntity } from 'src/utils/entities/batch-payload.entity';
// import { Throttle } from '@nestjs/throttler';

@Controller('diseaseAreas')
@ApiTags('disease area', 'dropdown options')
export class DiseaseAreaController {
  constructor(private readonly diseaseAreaService: DiseaseAreaService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'DiseaseArea' })
  @ApiOperation({
    summary: 'Create disease area/s',
  })
  @ApiBody({ type: DiseaseAreaDto, isArray: true })
  @ApiCreatedResponse({
    description: 'Disease area/s created',
    type: BatchPayloadEntity,
  })
  createDiseaseAreas(@Body() dto: DiseaseAreaDto[]) {
    return this.diseaseAreaService.createDiseaseAreas(dto);
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: 'DiseaseArea' })
  @ApiOperation({
    summary: 'Get single disease area',
  })
  @ApiOkResponse({
    description: 'Disease area retrieved',
    type: DiseaseAreaEntity,
  })
  async findOneById(@Param('id') id: number) {
    return new DiseaseAreaEntity(await this.diseaseAreaService.findOneById(id));
  }

  @Get()
  // @Throttle(50, 60)
  // @Throttle(100, 60)
  @CheckAbilities({ action: Action.Read, subject: 'DiseaseArea' })
  @ApiOperation({
    summary: 'Get disease area/s (filter)',
    description:
      'Retrieves the disease area/s by filtering them, sorting and doing all kinds of other operations.' +
      '\n\n<strong>By default, the result is returned with common disease areas at the top.</strong>',
  })
  @ApiOkResponse({
    type: DiseaseAreaPaginationEntity,
  })
  @NoAutoSerialize()
  findAll(@Query() filterParamsDto: FilterParamsDto) {
    return serializePaginationResult(
      this.diseaseAreaService.findAll(filterParamsDto),
      DiseaseAreaEntity,
    );
  }
}
