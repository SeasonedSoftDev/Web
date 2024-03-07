import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LocationService } from './location.service';
import { LocationDto } from './dto';
import { LocationEntity } from './entities/location.entity';
import { LocationPaginationEntity } from './entities/location-pagination.entity';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { BatchPayloadEntity } from 'src/utils/entities/batch-payload.entity';
import { Action } from 'src/core/auth/ability';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Public } from 'src/core/auth/decorators';
// import { Throttle } from '@nestjs/throttler';

@Controller('locations')
@ApiTags('location', 'dropdown options')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'Location' })
  @ApiOperation({
    summary: 'Create location/s',
  })
  @ApiBody({ type: LocationDto, isArray: true })
  @ApiCreatedResponse({
    description: 'location/s created.',
    type: BatchPayloadEntity,
  })
  createLocations(@Body() dto: LocationDto[]) {
    return this.locationService.createLocations(dto);
  }

  @Get(':id')
  // @CheckAbilities({ action: Action.Read, subject: 'Location' })
  @Public()
  @ApiOperation({
    summary: 'Get single location',
  })
  @ApiOkResponse({
    description: 'Location retrieved',
    type: LocationEntity,
  })
  async findOneById(@Param('id') id: number) {
    return new LocationEntity(await this.locationService.findOneById(id));
  }

  @Get()
  // @CheckAbilities({ action: Action.Read, subject: 'Location' })
  @Public()
  // @Throttle(50, 60)
  // @Throttle(100, 60)
  @ApiOperation({
    summary: 'Get location/s (filter)',
    description:
      'Retrieves the location/s by filtering them, sorting and doing all kinds of other operations.' +
      '\n\n<strong>By default, the result is returned with common cities/countries at the top.</strong>',
  })
  @ApiOkResponse({
    type: LocationPaginationEntity,
  })
  @NoAutoSerialize()
  findAll(@Query() filterParamsDto: FilterParamsDto) {
    return serializePaginationResult(
      this.locationService.findAll(filterParamsDto),
      LocationEntity,
    );
  }
}
