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
import { LegalsService } from './legals.service';
import { CreateLegalDto } from './dto/create-legal.dto';
import { UpdateLegalDto } from './dto/update-legal.dto';
import { FilterDto } from './dto/filter.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/auth/decorators';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';

@Controller('legals')
@ApiTags('legals')
export class LegalsController {
  constructor(private readonly legalsService: LegalsService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'Legal' })
  create(@Body() createLegalDto: CreateLegalDto) {
    return this.legalsService.create(createLegalDto);
  }

  @Public()
  @Get()
  findAll(@Query() filters: FilterDto) {
    return this.legalsService.findAll(filters);
  }

  @Public()
  @Get('/mostRecent')
  getMostRecent(@Query('language') language: 'en' | 'de') {
    return this.legalsService.getMostRecent(language);
  }

  @Public()
  @Get('/mostRecent/html')
  getMostRecentHTML(@Query('language') language: 'en' | 'de') {
    return this.legalsService.getMostRecentHTML(language);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.legalsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLegalDto: UpdateLegalDto) {
    return this.legalsService.update(+id, updateLegalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.legalsService.remove(+id);
  }
}
