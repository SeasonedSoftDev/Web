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

import { InfluencerSizesService } from './influencer-sizes.service';

import { CreateInfluencerSizeDto } from './dto/create-influencer-size.dto';

import { UpdateInfluencerSizeDto } from './dto/update-influencer-size.dto';
// import { Throttle } from '@nestjs/throttler';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InfluencerSizePaginationEntity } from './entities/influencer-size-pagination.entity';
import { InfluencerSizeEntity } from './entities/influencer-size.entity';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';

@Controller('influencerSizes')
@ApiTags('influencer size', 'dropdown options')
export class InfluencerSizesController {
  constructor(
    private readonly influencerSizesService: InfluencerSizesService,
  ) {}

  @Post()
  create(@Body() createInfluencerSizeDto: CreateInfluencerSizeDto) {
    return this.influencerSizesService.create(createInfluencerSizeDto);
  }

  @Get()
  // @Throttle(50, 60)
  // @Throttle(100, 60)
  @ApiOperation({
    summary: 'Get influencer size/s (filter)',
    description:
      'Retrieves the influencer size/s by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    type: InfluencerSizePaginationEntity,
  })
  findAll(@Query() filterParamsDto: FilterParamsDto) {
    return serializePaginationResult(
      this.influencerSizesService.findAll(filterParamsDto),
      InfluencerSizeEntity,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.influencerSizesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInfluencerSizeDto: UpdateInfluencerSizeDto,
  ) {
    return this.influencerSizesService.update(+id, updateInfluencerSizeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.influencerSizesService.remove(+id);
  }
}
