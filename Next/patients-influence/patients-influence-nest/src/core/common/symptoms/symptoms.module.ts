import { Module } from '@nestjs/common';
import { SymptomsService } from './symptoms.service';
import { SymptomsController } from './symptoms.controller';

@Module({
  controllers: [SymptomsController],
  providers: [SymptomsService],
})
export class SymptomsModule {}
