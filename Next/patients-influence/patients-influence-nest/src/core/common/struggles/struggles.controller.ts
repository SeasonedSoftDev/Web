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
import { StrugglesService } from './struggles.service';
import { CreateStruggleDto } from './dto/create-struggle.dto';
import { UpdateStruggleDto } from './dto/update-struggle.dto';

@Controller('struggles')
export class StrugglesController {
  constructor(private readonly strugglesService: StrugglesService) {}

  @Post()
  create(@Body() createStruggleDto: CreateStruggleDto) {
    return this.strugglesService.create(createStruggleDto);
  }

  @Get()
  findAll() {
    return this.strugglesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.strugglesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStruggleDto: UpdateStruggleDto,
  ) {
    return this.strugglesService.update(id, updateStruggleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.strugglesService.remove(id);
  }
}
