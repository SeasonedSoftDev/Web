import { Module } from '@nestjs/common';
import { BenefitService } from './benefit.service';
import { BenefitController } from './benefit.controller';

@Module({
  controllers: [BenefitController],
  providers: [BenefitService],
})
export class BenefitModule {}
