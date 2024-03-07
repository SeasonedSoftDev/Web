import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Put,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/core/auth/ability/decorators/ability.decorator';
import { Action } from 'src/core/auth/ability';
import { InfluencerSurveyAmount } from '@prisma/client';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { UpsertSurveyDesiredIncomeDto } from './dto/upsert-survey-desired-income.dto';
import { SurveyDesiredIncomeEntity } from './entities/survey-desired-income.entity';
import { serializeArray } from 'src/utils/serializers/array.serializer';
import { Response } from 'express';
import { SurveyType } from './enums/survey-type.enum';
import { serializeEnum } from 'src/utils/serializers/enum-result.serializer';
import { EnumItemResult } from 'src/utils/object-definitions/results/enum-item-result';
import { SurveyDesiredIncomeService } from './survey-desired-income.service';
import { validate } from 'class-validator';

@Controller('influencer/:userId/desiredIncome/survey')
@ApiTags('influencer')
export class SurveyDesiredIncomeController {
  constructor(
    private readonly surveyDesiredIncomeService: SurveyDesiredIncomeService,
  ) {}

  @Get('surveyTypes')
  // ? @CheckAbilities({ action: Action.Read, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Get survey types',
    description:
      'Retrieves available survey types (survey type enum/property).',
  })
  @ApiOkResponse({ type: EnumItemResult, isArray: true })
  @ApiTags('enums and types')
  @NoAutoSerialize()
  getAvailableSurveyTypes(@Res() res: Response) {
    return res.json(serializeEnum(SurveyType));
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Retrieve survey desired income',
    description: 'Retrieves desired income for each type of a survey.',
  })
  @ApiOkResponse({ type: SurveyDesiredIncomeEntity, isArray: true })
  @NoAutoSerialize()
  get(@Param('userId', ParseIntPipe) userId: number) {
    return serializeArray<InfluencerSurveyAmount, SurveyDesiredIncomeEntity>(
      this.surveyDesiredIncomeService.get(userId),
      SurveyDesiredIncomeEntity,
    );
  }

  @Put()
  @CheckAbilities({ action: Action.Update, subject: 'Influencer' })
  @ApiOperation({
    summary: 'Update/Create survey desired income',
    description:
      'Updates or creates survey desired income for any type of a survey. If none exists by given ID, new is created for the influencer. If it exists by given ID, updates a whole resource.',
  })
  @ApiBody({ type: UpsertSurveyDesiredIncomeDto, isArray: true })
  @ApiOkResponse({ type: SurveyDesiredIncomeEntity, isArray: true })
  @NoAutoSerialize()
  async create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body(new ParseArrayPipe({ items: UpsertSurveyDesiredIncomeDto }))
    upsertSurveyDesiredIncomeDto: UpsertSurveyDesiredIncomeDto[],
  ) {
    return serializeArray<InfluencerSurveyAmount, SurveyDesiredIncomeEntity>(
      this.surveyDesiredIncomeService.upsert(
        userId,
        upsertSurveyDesiredIncomeDto,
      ),
      SurveyDesiredIncomeEntity,
    );
  }
}
