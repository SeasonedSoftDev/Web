import { CampaignExampleImage } from '@prisma/client';

export class ExampleImageEntity implements Partial<CampaignExampleImage> {
  id: number;
  campaignId?: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ExampleImageEntity>) {
    Object.assign(this, partial);
  }
}
