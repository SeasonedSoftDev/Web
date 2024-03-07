import { Test, TestingModule } from '@nestjs/testing';
import { LegalsService } from './legals.service';

describe('LegalsService', () => {
  let service: LegalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LegalsService],
    }).compile();

    service = module.get<LegalsService>(LegalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
