import { CampaignReport } from '@prisma/client';
import { PlatformProductOrderEntity } from 'src/core/platform-product/entities';
import { CampaignEntity } from './campaign.entity';
import { ReportType } from '../enums';

export class CampaignReportEntity implements CampaignReport {
  id: number;
  platformProductOrderId: number;
  campaignId: number;
  reportType: ReportType;
  status: number;
  description: string;
  reach: boolean;
  numOfLikes: boolean;
  numOfComments: boolean;
  websiteClicks: boolean;
  engagement: boolean;
  costPerTarget: boolean;
  costPerClick: boolean;
  costPerLike: boolean;
  costPerComment: boolean;
  costPerEngagement: boolean;
  overlap: boolean;
  createdAt: Date;
  updatedAt: Date;

  platformProductOrder: PlatformProductOrderEntity;
  campaign: CampaignEntity;

  constructor({
    platformProductOrder,
    campaign,
    ...data
  }: Partial<CampaignReportEntity>) {
    Object.assign(this, data);

    if (platformProductOrder)
      this.platformProductOrder = new PlatformProductOrderEntity(
        platformProductOrder,
      );
    if (campaign) this.campaign = new CampaignEntity(campaign);
  }
}
