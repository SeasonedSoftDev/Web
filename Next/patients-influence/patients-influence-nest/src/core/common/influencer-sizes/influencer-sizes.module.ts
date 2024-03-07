import { Module } from '@nestjs/common';
import { InfluencerSizesService } from './influencer-sizes.service';
import { InfluencerSizesController } from './influencer-sizes.controller';

@Module({
  controllers: [InfluencerSizesController],
  providers: [InfluencerSizesService],
})
export class InfluencerSizesModule {}
