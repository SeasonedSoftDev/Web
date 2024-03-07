import { Module } from '@nestjs/common';
import { DiseaseAreaService } from './disease-area.service';
import { DiseaseAreaController } from './disease-area.controller';

@Module({
  providers: [DiseaseAreaService],
  controllers: [DiseaseAreaController],
})
export class DiseaseAreaModule {}
