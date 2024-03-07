import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';

@Injectable()
export class InsightService {
  constructor(private readonly prismaService: PrismaService) {}

  /* create(createInsightDto: CreateInsightDto) {
    return 'This action adds a new insight';
  }

  findAll() {
    return `This action returns all insight`;
  }

  findOne(id: number) {
    return `This action returns a #${id} insight`;
  }

  update(id: number, updateInsightDto: UpdateInsightDto) {
    return `This action updates a #${id} insight`;
  }

  remove(id: number) {
    return `This action removes a #${id} insight`;
  } */
}
