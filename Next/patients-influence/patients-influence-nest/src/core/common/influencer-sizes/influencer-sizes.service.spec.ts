import { Test, TestingModule } from '@nestjs/testing';
import { InfluencerSizesService } from './influencer-sizes.service';

describe('InfluencerSizesService', () => {
  let service: InfluencerSizesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfluencerSizesService],
    }).compile();

    service = module.get<InfluencerSizesService>(InfluencerSizesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
