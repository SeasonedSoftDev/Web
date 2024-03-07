import { Injectable } from '@nestjs/common';
import { CreateStruggleDto } from './dto/create-struggle.dto';
import { UpdateStruggleDto } from './dto/update-struggle.dto';
import { PrismaService } from 'src/integrations/prisma/prisma.service';

@Injectable()
export class StrugglesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createStruggleDto: CreateStruggleDto) {
    return 'This action adds a new struggle';
  }

  findAll() {
    return this.prismaService.struggle.findMany({ orderBy: { name: 'asc' } });
  }

  findOne(id: number) {
    return this.prismaService.struggle.findFirstOrThrow({
      where: { id },
    });
  }

  update(id: number, updateStruggleDto: UpdateStruggleDto) {
    return `This action updates a #${id} struggle`;
  }

  remove(id: number) {
    return `This action removes a #${id} struggle`;
  }
}
