import { Test, TestingModule } from '@nestjs/testing';
import { IndustryController } from './industry.controller';
import { IndustryService } from './industry.service';

describe('IndustryController', () => {
  let controller: IndustryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndustryController],
      providers: [IndustryService],
    }).compile();

    controller = module.get<IndustryController>(IndustryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
