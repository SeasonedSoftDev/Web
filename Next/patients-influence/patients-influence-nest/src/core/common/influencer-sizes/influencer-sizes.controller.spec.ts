import { Test, TestingModule } from '@nestjs/testing';
import { InfluencerSizesController } from './influencer-sizes.controller';
import { InfluencerSizesService } from './influencer-sizes.service';

describe('InfluencerSizesController', () => {
  let controller: InfluencerSizesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfluencerSizesController],
      providers: [InfluencerSizesService],
    }).compile();

    controller = module.get<InfluencerSizesController>(
      InfluencerSizesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
