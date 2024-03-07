import { Module, OnModuleInit } from '@nestjs/common';
import { SMLService } from './sml.service';
import { SMLController } from './sml.controller';
import { PlatformProductModule } from '../platform-product/platform-product.module';
import { StakeholdersModule } from '../stakeholders/stakeholders.module';
import { StakeholderPostProcessorService } from './jobs/stakeholder-post-processor.job';
import { NLPService } from './nlp.service';

@Module({
  imports: [PlatformProductModule, StakeholdersModule],
  controllers: [SMLController],
  providers: [SMLService, StakeholderPostProcessorService, NLPService],
  exports: [SMLService],
})
export class SMLModule implements OnModuleInit {
  constructor(
    private readonly stakeholderPostProcessorService: StakeholderPostProcessorService,
  ) {}

  async onModuleInit() {
    // * this should go to queue
    await this.stakeholderPostProcessorService.countTokensJob();
  }
}
