import { Module } from '@nestjs/common';
import { InsightService } from './insight.service';
import { InsightController } from './insight.controller';
import { InfluencersInsightService } from './influencers/influencers-insight.service';
import { InfluencerInsightController } from './influencers/influencers-insight.controller';
import { ClientsInsightController } from './clients/clients-insight.controller';
import { ClientsInsightService } from './clients/clients-insight.service';
import { CampaignsInsightController } from './campaigns/campaigns-insight.controller';
import { CampaignsInsightService } from './campaigns/campaigns-insight.service';
import { SurveysInsightController } from './surveys/surveys-insight.controller';
import { SurveysInsightService } from './surveys/surveys-insight.service';
import { SMLInsightController } from './sml/sml-insight.controller';
import { SMLInsightService } from './sml/sml-insight.service';
import { BenefitsInsightController } from './benefits/benefits-insight.controller';
import { BenefitsInsightService } from './benefits/benefits-insight.service';
import { FinanceInsightController } from './finance/finance-insight.controller';
import { FinanceInsightService } from './finance/finance-insight.service';
import { SMLModule } from '../sml/sml.module';
import { InfluencerModule } from '../influencer/influencer.module';
import { ReportsInsightController } from './reports/report-insight.controller';
import { ReportsInsightService } from './reports/report-insight.service';
import { AmbassadorsInsightService } from './ambassadors/ambassadors-insight.service';
import { AmbassadorsInsightController } from './ambassadors/ambassadors-insight.controller';

@Module({
  imports: [SMLModule, InfluencerModule],
  controllers: [
    InsightController,
    InfluencerInsightController,
    ClientsInsightController,
    CampaignsInsightController,
    SurveysInsightController,
    SMLInsightController,
    BenefitsInsightController,
    FinanceInsightController,
    ReportsInsightController,
    AmbassadorsInsightController,
  ],
  providers: [
    InsightService,
    InfluencersInsightService,
    ClientsInsightService,
    CampaignsInsightService,
    SurveysInsightService,
    SMLInsightService,
    BenefitsInsightService,
    FinanceInsightService,
    ReportsInsightService,
    AmbassadorsInsightService,
  ],
})
export class InsightModule {}
