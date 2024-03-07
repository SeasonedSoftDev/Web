import { Module } from '@nestjs/common';
import { EthnicityService } from './ethnicity.service';
import { EthnicityController } from './ethnicity.controller';

@Module({
  controllers: [EthnicityController],
  providers: [EthnicityService],
})
export class EthnicityModule {}
