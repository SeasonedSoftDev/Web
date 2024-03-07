import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { InfluencerCampaignAmount } from '@prisma/client';
import { UpsertCampaignDesiredIncomeDto } from './dto/upsert-campaign-desired-income.dto';
import { InfluencerService } from 'src/core/influencer/influencer.service';

@Injectable()
export class CampaignDesiredIncomeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly influencerService: InfluencerService,
  ) {}

  async get(userId: number) {
    // check if user exists and get its influencer ID
    const influencer = await this.influencerService.findOne(userId);

    return this.prismaService.influencerCampaignAmount.findMany({
      where: { influencerId: influencer.influencer.id },
    });
  }

  async upsert(
    userId: number,
    dto: UpsertCampaignDesiredIncomeDto,
    tx?: Omit<
      PrismaService,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
    execute?: boolean,
  ): Promise<InfluencerCampaignAmount>;
  async upsert(
    userId: number,
    dto: UpsertCampaignDesiredIncomeDto[],
    tx?: Omit<
      PrismaService,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
    execute?: boolean,
  ): Promise<InfluencerCampaignAmount[]>;
  async upsert(
    userId: number,
    dto: unknown,
    tx?: Omit<
      PrismaService,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
    execute = true,
  ) {
    // check if user exists and get its influencer ID
    const influencer = await this.influencerService.findOne(userId);

    if (Array.isArray(dto)) {
      const upserts = (dto as UpsertCampaignDesiredIncomeDto[]).map((d) => {
        const { id, ...data } = d;

        return id !== undefined
          ? (tx || this.prismaService).influencerCampaignAmount.upsert({
              where: { id },
              create: { ...data, influencerId: influencer.influencer.id },
              update: data,
            })
          : (tx || this.prismaService).influencerCampaignAmount.create({
              data: { ...data, influencerId: influencer.influencer.id },
            });
      });

      if (!execute) return Promise.all(upserts);

      return await Promise.all(upserts);
    } else {
      const { id, ...data } = dto as UpsertCampaignDesiredIncomeDto;

      const upsert =
        id !== undefined
          ? (tx || this.prismaService).influencerCampaignAmount.upsert({
              where: { id },
              create: { ...data, influencerId: influencer.influencer.id },
              update: data,
            })
          : (tx || this.prismaService).influencerCampaignAmount.create({
              data: { ...data, influencerId: influencer.influencer.id },
            });

      if (!execute) return upsert;

      return await upsert;
    }
  }
}
