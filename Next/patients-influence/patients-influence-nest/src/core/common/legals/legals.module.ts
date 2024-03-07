import { Module } from '@nestjs/common';
import { LegalsService } from './legals.service';
import { LegalsController } from './legals.controller';
import { PrismaModule } from 'src/integrations/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LegalsController],
  providers: [LegalsService],
})
export class LegalsModule {}
