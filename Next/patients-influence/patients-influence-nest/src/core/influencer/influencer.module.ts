import { Module, OnModuleInit } from '@nestjs/common';
import { InfluencerService } from './influencer.service';
import { InfluencerController } from './influencer.controller';
import { MailModule } from '../../integrations/mail/mail.module';
import { UsersModule } from '../../core/users/users.module';
import { CampaignDesiredIncomeController } from './subroutes/desired-income/campaign/campaign-desired-income.controller';
import { CampaignDesiredIncomeService } from './subroutes/desired-income/campaign/campaign-desired-income.service';
import { SurveyDesiredIncomeController } from './subroutes/desired-income/survey/survey-desired-income.controller';
import { SurveyDesiredIncomeService } from './subroutes/desired-income/survey/survey-desired-income.service';
import { SocialModule } from 'src/integrations/social/social.module';
import { StakeholdersModule } from '../stakeholders/stakeholders.module';
import { InfluencerDistributionUpdateService } from './jobs/influencer-distribution-update.job';
import { InfluencerReminderService } from './jobs/influencer-reminder.job';

@Module({
  imports: [MailModule, UsersModule, SocialModule, StakeholdersModule],
  providers: [
    InfluencerService,
    CampaignDesiredIncomeService,
    SurveyDesiredIncomeService,
    InfluencerDistributionUpdateService,
    InfluencerReminderService,
  ],
  controllers: [
    InfluencerController,
    CampaignDesiredIncomeController,
    SurveyDesiredIncomeController,
  ],
  exports: [CampaignDesiredIncomeService, InfluencerService],
})
export class InfluencerModule implements OnModuleInit {
  constructor(
    private readonly influencerDistributionUpdateService: InfluencerDistributionUpdateService,
    private readonly InfluencerReminderService: InfluencerReminderService,
  ) {}

  async onModuleInit() {
    // await this.InfluencerReminderService.remindAdminsAboutUnverifiedInfluencersJob();
    // TODO uncomment this.influencerDistributionUpdateService.updateInfluencerSurveyDesiredAmountDistributionJob();
    // TODO uncomment this.influencerDistributionUpdateService.updateInfluencerCampaignDesiredAmountDistributionJob();
  }
}
