import { Test, TestingModule } from '@nestjs/testing';
import { SymptomsService } from './symptoms.service';

describe('SymptomsService', () => {
  let service: SymptomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SymptomsService],
    }).compile();

    service = module.get<SymptomsService>(SymptomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
