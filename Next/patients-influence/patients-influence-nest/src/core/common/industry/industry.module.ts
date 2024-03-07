import { Module } from '@nestjs/common';
import { IndustryService } from './industry.service';
import { IndustryController } from './industry.controller';

@Module({
  controllers: [IndustryController],
  providers: [IndustryService],
})
export class IndustryModule {}
