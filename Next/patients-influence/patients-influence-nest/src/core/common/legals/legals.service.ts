import { Injectable } from '@nestjs/common';
import { CreateLegalDto } from './dto/create-legal.dto';
import { UpdateLegalDto } from './dto/update-legal.dto';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { FilterDto } from './dto/filter.dto';
import { Legal, Prisma } from '@prisma/client';

@Injectable()
export class LegalsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createLegalDto: CreateLegalDto) {
    return await this.prismaService.legal.create({
      data: {
        version: createLegalDto.version,
        type: createLegalDto.type,
        text: createLegalDto.text,
        language: createLegalDto.language,
      },
    });
  }

  async findAll({ newestOnly, legalIds }: FilterDto) {
    const whereQuery: Prisma.LegalWhereInput = {
      id: legalIds && { in: legalIds },
    };

    if (!newestOnly) {
      const legals = await this.prismaService.legal.findMany({
        where: whereQuery,
      });

      return legals;
    }

    const legals = await this.prismaService.legal.groupBy({
      by: ['type', 'createdAt'],
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    return legals;
  }

  async findOne(id: number) {
    return await this.prismaService.legal.findFirstOrThrow({
      where: { id },
    });
  }

  update(id: number, updateLegalDto: UpdateLegalDto) {
    return `This action updates a #${id} legal`;
  }

  remove(id: number) {
    return `This action removes a #${id} legal`;
  }

  async mostRecentLegal(type: number, language?: 'en' | 'de') {
    const legals = await this.prismaService.legal.findMany({
      where: {
        type,
        language,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    return legals.shift();
  }

  async getMostRecent(language?: 'en' | 'de') {
    const legals: {
      commonLegalId: null | number;
      patientSpecificLegalId: null | number;
      influencerCampaignLegalId: null | number;
    } = {
      commonLegalId: null,
      patientSpecificLegalId: null,
      influencerCampaignLegalId: null,
    };

    const commonLegal = await this.mostRecentLegal(0, language);
    const patientSpecificLegal = await this.mostRecentLegal(1, language);
    const influencerCampaignLegal = await this.mostRecentLegal(2, 'en');

    if (commonLegal) {
      legals.commonLegalId = commonLegal.id;
    }
    if (patientSpecificLegal) {
      legals.patientSpecificLegalId = patientSpecificLegal.id;
    }

    if (influencerCampaignLegal) {
      legals.influencerCampaignLegalId = influencerCampaignLegal.id;
    }

    return legals;
  }

  async getMostRecentHTML(language?: 'en' | 'de') {
    const commonLegal = await this.mostRecentLegal(0, language);
    const patientSpecificLegal = await this.mostRecentLegal(1, language);
    const influencerCampaignLegal = await this.mostRecentLegal(2, 'en');

    return {
      commonLegal: commonLegal || null,
      patientSpecificLegal: patientSpecificLegal || null,
      influencerCampaignLegal: influencerCampaignLegal || null,
    };
  }
}
