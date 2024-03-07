import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';

@Module({
  providers: [LocationService],
  controllers: [LocationController],
})
export class LocationModule {}
