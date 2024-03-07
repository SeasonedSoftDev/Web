import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { EthnicityService } from './ethnicity.service';
import { CreateEthnicityDto } from './dto/create-ethnicity.dto';
import { UpdateEthnicityDto } from './dto/update-ethnicity.dto';

@Controller('ethnicities')
export class EthnicityController {
  constructor(private readonly ethnicityService: EthnicityService) {}

  @Post()
  create(@Body() createEthnicityDto: CreateEthnicityDto) {
    return this.ethnicityService.create(createEthnicityDto);
  }

  @Get()
  findAll() {
    return this.ethnicityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ethnicityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEthnicityDto: UpdateEthnicityDto,
  ) {
    return this.ethnicityService.update(id, updateEthnicityDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ethnicityService.remove(id);
  }
}
