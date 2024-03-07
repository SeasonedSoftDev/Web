import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { InfluencerSurveyAmount } from '@prisma/client';
import { UpsertSurveyDesiredIncomeDto } from './dto/upsert-survey-desired-income.dto';
import { InfluencerService } from 'src/core/influencer/influencer.service';

@Injectable()
export class SurveyDesiredIncomeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly influencerService: InfluencerService,
  ) {}

  async get(userId: number) {
    // check if user exists and get its influencer ID
    const influencer = await this.influencerService.findOne(userId);

    return this.prismaService.influencerSurveyAmount.findMany({
      where: { influencerId: influencer.influencer.id },
    });
  }

  async upsert(
    userId: number,
    dto: UpsertSurveyDesiredIncomeDto,
    tx?: Omit<
      PrismaService,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
    execute?: boolean,
  ): Promise<InfluencerSurveyAmount>;
  async upsert(
    userId: number,
    dto: UpsertSurveyDesiredIncomeDto[],
    tx?: Omit<
      PrismaService,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
    execute?: boolean,
  ): Promise<InfluencerSurveyAmount[]>;
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
      const upserts = (dto as UpsertSurveyDesiredIncomeDto[]).map((d) => {
        const { id, ...data } = d;

        return id !== undefined
          ? (tx || this.prismaService).influencerSurveyAmount.upsert({
              where: { id },
              create: { ...data, influencerId: influencer.influencer.id },
              update: data,
            })
          : (tx || this.prismaService).influencerSurveyAmount.create({
              data: { ...data, influencerId: influencer.influencer.id },
            });
      });

      if (!execute) return Promise.all(upserts);

      return await Promise.all(upserts);
    } else {
      const { id, ...data } = dto as UpsertSurveyDesiredIncomeDto;

      const upsert =
        id !== undefined
          ? (tx || this.prismaService).influencerSurveyAmount.upsert({
              where: { id },
              create: { ...data, influencerId: influencer.influencer.id },
              update: data,
            })
          : (tx || this.prismaService).influencerSurveyAmount.create({
              data: { ...data, influencerId: influencer.influencer.id },
            });

      if (!execute) return upsert;

      return await upsert;
    }
  }
}
