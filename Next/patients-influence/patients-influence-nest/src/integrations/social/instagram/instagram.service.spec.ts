import { Test, TestingModule } from '@nestjs/testing';
import { InstagramService } from './instagram.service';

describe('InstagramService', () => {
  let service: InstagramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstagramService],
    }).compile();

    service = module.get<InstagramService>(InstagramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
