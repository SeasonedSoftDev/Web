import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { CurrencyEntity } from './entities';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { serializeArray } from 'src/utils/serializers/array.serializer';
import { Currency } from '@prisma/client';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @CheckAbilities({ action: Action.Create, subject: 'Currency' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return new CurrencyEntity(
      await this.currencyService.create(createCurrencyDto),
    );
  }

  @Get()
  @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return serializeArray<Currency, CurrencyEntity>(
      this.currencyService.findAll(),
      CurrencyEntity,
    );
  }

  @CheckAbilities({ action: Action.Update, subject: 'Currency' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateOneById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    return new CurrencyEntity(
      await this.currencyService.updateOneById(id, updateCurrencyDto),
    );
  }

  @CheckAbilities({ action: Action.Delete, subject: 'Currency' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteOneById(@Param('id', ParseIntPipe) id: number) {
    return new CurrencyEntity(await this.currencyService.deleteOneById(id));
  }
}
