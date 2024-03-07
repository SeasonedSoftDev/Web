import { Test, TestingModule } from '@nestjs/testing';
import { LegalsController } from './legals.controller';
import { LegalsService } from './legals.service';

describe('LegalsController', () => {
  let controller: LegalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LegalsController],
      providers: [LegalsService],
    }).compile();

    controller = module.get<LegalsController>(LegalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
