import { Injectable } from '@nestjs/common';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { PrismaService } from 'src/integrations/prisma/prisma.service';

@Injectable()
export class InterestsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createInterestDto: CreateInterestDto) {
    return 'This action adds a new interest';
  }

  findAll() {
    return this.prismaService.interest.findMany({ orderBy: { name: 'asc' } });
  }

  findOne(id: number) {
    return this.prismaService.interest.findFirstOrThrow({ where: { id } });
  }

  update(id: number, updateInterestDto: UpdateInterestDto) {
    return `This action updates a #${id} interest`;
  }

  remove(id: number) {
    return `This action removes a #${id} interest`;
  }
}
