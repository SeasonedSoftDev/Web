import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { PrismaService } from 'src/integrations/prisma/prisma.service';

@Injectable()
export class CurrencyService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createCurrencyDto: CreateCurrencyDto) {
    return this.prismaService.currency.create({
      data: { code: createCurrencyDto.code },
    });
  }

  findAll() {
    return this.prismaService.currency.findMany({});
  }

  updateOneById(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    return this.prismaService.currency.update({
      where: { id },
      data: { code: updateCurrencyDto.code },
    });
  }

  deleteOneById(id: number) {
    return this.prismaService.currency.delete({ where: { id } });
  }
}
