import { Test, TestingModule } from '@nestjs/testing';
import { IndustryService } from './industry.service';

describe('IndustryService', () => {
  let service: IndustryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndustryService],
    }).compile();

    service = module.get<IndustryService>(IndustryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
