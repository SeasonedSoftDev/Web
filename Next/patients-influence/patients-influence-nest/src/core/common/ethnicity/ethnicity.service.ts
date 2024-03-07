import { Injectable } from '@nestjs/common';
import { CreateEthnicityDto } from './dto/create-ethnicity.dto';
import { UpdateEthnicityDto } from './dto/update-ethnicity.dto';
import { PrismaService } from 'src/integrations/prisma/prisma.service';

@Injectable()
export class EthnicityService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createEthnicityDto: CreateEthnicityDto) {
    return 'This action adds a new ethnicity';
  }

  findAll() {
    return this.prismaService.ethnicity.findMany({ orderBy: { name: 'asc' } });
  }

  findOne(id: number) {
    return this.prismaService.ethnicity.findFirstOrThrow({ where: { id } });
  }

  update(id: number, updateEthnicityDto: UpdateEthnicityDto) {
    return `This action updates a #${id} ethnicity`;
  }

  remove(id: number) {
    return `This action removes a #${id} ethnicity`;
  }
}
