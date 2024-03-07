import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { PrismaModule } from 'src/integrations/prisma/prisma.module';
import { PlatformProductModule } from '../platform-product/platform-product.module';
import { FinanceModule } from '../finance/finance.module';
import { MailModule } from 'src/integrations/mail/mail.module';

@Module({
  imports: [PrismaModule, PlatformProductModule, FinanceModule, MailModule],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
