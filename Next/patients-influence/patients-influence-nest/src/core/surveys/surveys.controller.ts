import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Action } from '../auth/ability';
import { CheckAbilities } from '../auth/ability/decorators/ability.decorator';
import { SurveyEntity } from './entities/survey.entity';
import { AuthUser } from '../auth/decorators';
import { User } from '@prisma/client';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { SurveyPaginationEntity } from './entities/survey-pagination.entity';
import { PlatformProductOrderInfluencerEntity } from '../platform-product/entities/platform-product-order-influencer.entity';
import { serializeArray } from 'src/utils/serializers/array.serializer';
import { BatchPayloadEntity } from 'src/utils/entities/batch-payload.entity';
import { UserRole } from 'src/utils';
import { SubmitSurveyResultDto } from './dto/submit-survey-result.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionEntity } from './entities/question.entity';
import { CreateAnswerChoiceDto } from './dto/create-answer-choice.dto';
import { AnswerEntity } from './entities/answer.entity';
import { UpdateAnswerChoiceDto } from './dto/update-answer-choice.dto';
import { EnumItemResult } from 'src/utils/object-definitions/results/enum-item-result';
import { Response } from 'express';
import { serializeEnum } from 'src/utils/serializers/enum-result.serializer';
import { SurveyType } from './enums/survey-type.enum';
import { QuestionType } from './enums/question-type.enum';
import { SurveyFilterDto } from './dto/survey-filter.dto';
import { ProductOrderInfluencerStatus } from '../platform-product/enums/product-order-influencer-status.enum';
import { CreditPackage } from './enums/credit-package.enum';
import { cacheKeys } from 'src/config';
import { CacheInvalidate } from 'src/decorators/cache-invalidate.decorator';
import { DeleteManySurveysDto } from './dto/delete-many-surveys.dto';
import { SurveyInviteInfluencers } from './dto/survey-invite-influencers.dto';
import { GetInfluencerSurveyDto } from './dto/get-influencer-survey.dto';
import { FilterResponseCriteriaDto } from './dto/filter-response-criteria.dto';
import { FindByIdsDto } from '../finance/dto/find-by-ids.dto';

@Controller('surveys')
@ApiTags('surveys')
export class SurveysController {
  private static readonly cacheInvalidateOnSurveyCreate = [
    cacheKeys.insightClientSurveys, // count surveys
    cacheKeys.insightClientSurveyInfluencers, // count survey influencers
  ];
  private static readonly cacheInvalidateOnSurveyUpdate =
    SurveysController.cacheInvalidateOnSurveyCreate;
  private static readonly cacheInvalidateOnSurveyDelete =
    SurveysController.cacheInvalidateOnSurveyCreate;
  private static readonly cacheInvalidateOnSurveyInfluencersUpdate = [
    cacheKeys.insightClientSurveyInfluencers,
  ];

  constructor(private readonly surveysService: SurveysService) {}

  @Get('exports')
  async exportCampaigns(@Query() dto: FindByIdsDto, @AuthUser() user: User) {
    return this.surveysService.exportSurveys(dto, user);
  }

  //#region ENUMS
  @Get('creditPackages')
  @ApiOperation({
    summary: 'Get credit packages',
    description:
      'Retrieves available credit packages (credit package enum/property).',
  })
  @ApiOkResponse({ type: EnumItemResult, isArray: true })
  @ApiTags('enums and types')
  @NoAutoSerialize()
  getAvailableCreditPackages(@Res() res: Response) {
    return res.json(serializeEnum(CreditPackage));
  }

  @Get('surveyTypes')
  // ? @CheckAbilities({ action: Action.Read, subject: 'Survey' })
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

  @Get('questionTypes')
  // ? @CheckAbilities({ action: Action.Read, subject: 'Survey' })
  @ApiOperation({
    summary: 'Get survey question types',
    description:
      'Retrieves available survey question types (survey question type enum/property).',
  })
  @ApiOkResponse({ type: EnumItemResult, isArray: true })
  @ApiTags('enums and types')
  @NoAutoSerialize()
  getAvailableSurveyQuestionTypes(@Res() res: Response) {
    return res.json(serializeEnum(QuestionType));
  }

  @Get('surveyInfluencerStatuses')
  // ? @CheckAbilities({ action: Action.Read, subject: 'Survey' })
  @ApiOperation({
    summary: 'Get survey influencer statuses',
    description:
      'Retrieves available survey influencer statuses (product order influencer status enum/property).',
  })
  @ApiOkResponse({ type: EnumItemResult, isArray: true })
  @ApiTags('enums and types')
  @NoAutoSerialize()
  getAvailableSurveyInfluencerStatuses(@Res() res: Response) {
    return res.json(serializeEnum(ProductOrderInfluencerStatus));
  }
  //#endregion

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'Survey' })
  @ApiOperation({
    summary: 'Create a new survey',
    description: 'Creates a new survey.',
  })
  @ApiBody({ type: CreateSurveyDto })
  @ApiCreatedResponse({ type: SurveyEntity })
  @CacheInvalidate(...SurveysController.cacheInvalidateOnSurveyCreate)
  async create(
    @Body() createSurveyDto: CreateSurveyDto,
    @AuthUser() user: User,
  ) {
    return new SurveyEntity(
      await this.surveysService.create(createSurveyDto, user),
    );
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'Survey' })
  @ApiOperation({
    summary: 'Get survey/s (filter)',
    description:
      'Retrieves the surveys by filtering them, sorting and doing all kinds of other operations.',
  })
  @ApiOkResponse({
    description: 'Survey/s retrieved',
    type: SurveyPaginationEntity,
  })
  @NoAutoSerialize()
  findAll(
    @Query() filterParamsDto: FilterParamsDto,
    @Query() filters: SurveyFilterDto,
    @AuthUser() user: User,
  ) {
    return serializePaginationResult(
      this.surveysService.findAll(filterParamsDto, filters, user),
      SurveyEntity,
    );
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: 'Survey' })
  @ApiOkResponse({
    description: 'Survey retrieved',
    type: SurveyEntity,
  })
  async findOne(@Param('id') id: number, @AuthUser() user: User) {
    return new SurveyEntity(await this.surveysService.findOne(id, user));
  }

  @Get(':id/influencerSurvey')
  @CheckAbilities({ action: Action.Read, subject: 'Survey' })
  @ApiOkResponse({
    description: 'Survey retrieved',
  })
  async findOneInfluencersSurvey(
    @Param('id') id: number,
    @Query() params: GetInfluencerSurveyDto,
    @AuthUser() user: User,
  ) {
    const { influencerId } = params;
    return await this.surveysService.findOneInfluencersSurvey(
      id,
      user,
      influencerId,
    );
  }

  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: 'Survey' })
  @ApiOperation({
    summary: 'Update a survey',
    description: 'Updates a survey',
  })
  @ApiBody({ type: UpdateSurveyDto })
  @ApiOkResponse({ type: SurveyEntity })
  @CacheInvalidate(...SurveysController.cacheInvalidateOnSurveyUpdate)
  async update(
    @Param('id') id: number,
    @Body() updateSurveyDto: UpdateSurveyDto,
    @AuthUser() user: User,
  ) {
    return new SurveyEntity(
      await this.surveysService.update(id, updateSurveyDto, user),
    );
  }

  @Post(':id/addInfluencers')
  @ApiBody({
    description: 'User IDs',
    type: Number,
    isArray: true,
  })
  @ApiCreatedResponse({
    type: PlatformProductOrderInfluencerEntity,
    isArray: true,
  })
  @NoAutoSerialize()
  @CacheInvalidate(
    ...SurveysController.cacheInvalidateOnSurveyInfluencersUpdate,
  )
  async addInfluencers(
    @Param('id') id: number,
    @Body() influencerIds: number[],
    @AuthUser() user: User,
  ) {
    return serializeArray(
      this.surveysService.addInfluencers(id, influencerIds, user),
      PlatformProductOrderInfluencerEntity,
    );
  }

  @Put(':id/inviteInfluencers')
  @ApiBody({
    description: 'User IDs',
    type: Number,
    isArray: true,
  })
  @ApiOkResponse({
    type: PlatformProductOrderInfluencerEntity,
    isArray: true,
  })
  @NoAutoSerialize()
  @CacheInvalidate(
    ...SurveysController.cacheInvalidateOnSurveyInfluencersUpdate,
  )
  async inviteInfluencers(
    @Param('id') id: number,
    @Body() dto: SurveyInviteInfluencers,
    @AuthUser() user: User,
  ) {
    return serializeArray(
      this.surveysService.inviteInfluencers(id, dto, user),
      PlatformProductOrderInfluencerEntity,
    );
  }

  @Put(':id/acceptInvitation')
  @ApiOkResponse({
    type: PlatformProductOrderInfluencerEntity,
  })
  @CacheInvalidate(
    ...SurveysController.cacheInvalidateOnSurveyInfluencersUpdate,
  )
  async acceptInvitation(@Param('id') id: number, @AuthUser() user: User) {
    return new PlatformProductOrderInfluencerEntity(
      await this.surveysService.acceptInvitation(id, user),
    );
  }

  @Put(':id/declineInvitation')
  @ApiOkResponse({
    type: PlatformProductOrderInfluencerEntity,
  })
  @CacheInvalidate(
    ...SurveysController.cacheInvalidateOnSurveyInfluencersUpdate,
  )
  async declineInvitation(@Param('id') id: number, @AuthUser() user: User) {
    return new PlatformProductOrderInfluencerEntity(
      await this.surveysService.declineInvitation(id, user),
    );
  }

  @Delete('deleteSelectedSurveys')
  @CheckAbilities({ action: Action.Delete, subject: 'Survey' })
  @ApiOkResponse({
    description: 'Survey deleted',
    type: SurveyEntity,
  })
  @CacheInvalidate(...SurveysController.cacheInvalidateOnSurveyDelete)
  async removeManySurveys(@Body() dto: DeleteManySurveysDto) {
    return this.surveysService.removeManySurveys(dto);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: 'Survey' })
  @ApiOkResponse({
    description: 'Survey deleted',
    type: SurveyEntity,
  })
  @CacheInvalidate(...SurveysController.cacheInvalidateOnSurveyDelete)
  async remove(@Param('id') id: number) {
    return new SurveyEntity(await this.surveysService.remove(id));
  }

  @Delete(':id/removeInfluencers')
  @ApiBody({
    description: 'User IDs',
    type: Number,
    isArray: true,
  })
  @ApiOkResponse({
    type: BatchPayloadEntity,
  })
  @NoAutoSerialize()
  @CacheInvalidate(
    ...SurveysController.cacheInvalidateOnSurveyInfluencersUpdate,
  )
  async removeInfluencers(
    @Param('id') id: number,
    @Body() influencerIds: number[],
    @AuthUser() user: User,
  ) {
    if (user.role === UserRole.Influencer) {
      return this.surveysService.removeInfluencerSelf(id, user);
    }

    return this.surveysService.removeInfluencers(id, influencerIds);
  }

  @Post(':id/submitSurveyResults')
  @ApiBody({
    type: SubmitSurveyResultDto,
  })
  /* @ApiCreatedResponse({
    type: undefined,
  }) */
  @CacheInvalidate(
    // TODO review
    ...SurveysController.cacheInvalidateOnSurveyInfluencersUpdate,
  )
  async submitSurveyResult(
    @Param('id') id: number,
    @Body() data: SubmitSurveyResultDto[],
    @AuthUser() user: User,
  ) {
    return this.surveysService.submitSurveyResult(id, user, data);
  }

  @Put(':id/approveSubmission')
  @ApiBody({
    description: 'User IDs',
    type: Number,
    isArray: true,
  })
  @ApiOkResponse({
    type: BatchPayloadEntity,
  })
  @CacheInvalidate(
    ...SurveysController.cacheInvalidateOnSurveyInfluencersUpdate,
  )
  async approveSurveyResult(
    @Param('id') id: number,
    @Body() body: { influencerIds: number[] },
    @AuthUser() user: User,
  ) {
    const { influencerIds } = body;

    return this.surveysService.approveSurveyResult(id, influencerIds, user);
  }

  @Put(':id/disapproveSubmission')
  @ApiBody({
    description: 'User IDs',
    type: Number,
    isArray: true,
  })
  @ApiOkResponse({
    type: BatchPayloadEntity,
  })
  @CacheInvalidate(
    ...SurveysController.cacheInvalidateOnSurveyInfluencersUpdate,
  )
  async disapproveSurveyResult(
    @Param('id') id: number,
    @Body() body: { influencerIds: number[] },
    @AuthUser() user: User,
  ) {
    const { influencerIds } = body;
    return this.surveysService.disapproveSurveyResult(id, influencerIds, user);
  }

  @Put(':id/startSurvey')
  @CacheInvalidate(...SurveysController.cacheInvalidateOnSurveyUpdate)
  async startSurvey(@Param('id') id: number, @AuthUser() user: User) {
    if (user.role !== UserRole.SuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.surveysService.startSurvey(id);
  }

  @Put(':id/finishSurvey')
  @CacheInvalidate(...SurveysController.cacheInvalidateOnSurveyUpdate)
  async finishCampaign(@Param('id') id: number, @AuthUser() user: User) {
    if (user.role !== UserRole.SuperAdmin) {
      throw new UnauthorizedException();
    }
    return this.surveysService.finishSurvey(id);
  }

  @Put(':id/archiveSurvey')
  @CacheInvalidate(...SurveysController.cacheInvalidateOnSurveyUpdate)
  async archiveCampaign(@Param('id') id: number) {
    return this.surveysService.archiveSurvey(id);
  }

  //#region QUESTIONS
  @Post(':id/questions')
  @ApiBody({
    type: CreateQuestionDto,
  })
  @ApiCreatedResponse({
    type: QuestionEntity,
  })
  @CacheInvalidate(...SurveysController.cacheInvalidateOnSurveyUpdate)
  async createQuestion(
    @Param('id') id: number,
    @Body() dto: CreateQuestionDto,
    @AuthUser() user: User,
  ) {
    return new QuestionEntity(
      await this.surveysService.createQuestion(id, dto, user),
    );
  }

  @Get(':id/questions')
  @ApiOkResponse({
    type: QuestionEntity,
    isArray: true,
  })
  @NoAutoSerialize()
  async getQuestions(@Param('id') id: number, @AuthUser() user: User) {
    return serializeArray(
      this.surveysService.getQuestions(id, user, true),
      QuestionEntity,
    );
  }

  @Patch(':id/questions/:questionId')
  @ApiOkResponse({
    type: QuestionEntity,
  })
  @CacheInvalidate(...SurveysController.cacheInvalidateOnSurveyUpdate)
  async updateQuestion(
    @Param('id') id: number,
    @Param('questionId') questionId: number,
    @Body() dto: UpdateQuestionDto,
  ) {
    return new QuestionEntity(
      await this.surveysService.updateQuestion(id, questionId, dto, true),
    );
  }

  @Get(':id/questions/responses/:questionId')
  async getSurveyQuestionResponsesForGraphs(
    @Param('id') id: number,
    @Param('questionId') questionId: number,
    @Query() filterCriteriaDto: FilterResponseCriteriaDto,
    @AuthUser() user: User,
  ) {
    return await this.surveysService.getQuestionResponsesForGraphs(
      id,
      user,
      questionId,
      filterCriteriaDto,
    );
  }

  @Get(':id/demographics')
  async getSurveyDemographicGraphsData(
    @Param('id') id: number,
    @AuthUser() user: User,
  ) {
    return await this.surveysService.getSurveyDemographicGraphsData(id, user);
  }

  @Delete(':id/questions/:questionId')
  @ApiOkResponse({
    type: QuestionEntity,
  })
  @CacheInvalidate(...SurveysController.cacheInvalidateOnSurveyUpdate)
  async deleteQuestion(
    @Param('id') id: number,
    @Param('questionId') questionId: number,
  ) {
    return new QuestionEntity(
      await this.surveysService.deleteQuestion(questionId),
    );
  }
  //#endregion

  //#region QUESTION ANSWER CHOICES/OPTIONS
  @Post(':id/questions/:questionId/answerChoices')
  @ApiBody({
    type: CreateAnswerChoiceDto,
  })
  @ApiCreatedResponse({
    type: AnswerEntity,
  })
  @CacheInvalidate(...SurveysController.cacheInvalidateOnSurveyUpdate)
  async createQuestionAnswerChoice(
    @Param('id') id: number,
    @Param('questionId') questionId: number,
    @Body() dto: CreateAnswerChoiceDto,
  ) {
    return new AnswerEntity(
      await this.surveysService.createAnswerChoice(questionId, dto),
    );
  }

  @Get(':id/questions/:questionId/answerChoices')
  @ApiOkResponse({
    type: AnswerEntity,
    isArray: true,
  })
  @NoAutoSerialize()
  async getQuestionAnswerChoices(
    @Param('id') id: number,
    @Param('questionId') questionId: number,
  ) {
    return serializeArray(
      this.surveysService.getAnswerChoices(questionId),
      AnswerEntity,
    );
  }

  @Patch(':id/questions/:questionId/answerChoices/:choiceId')
  @ApiOkResponse({
    type: AnswerEntity,
  })
  @CacheInvalidate(...SurveysController.cacheInvalidateOnSurveyUpdate)
  async updateQuestionAnswerChoice(
    @Param('id') id: number,
    @Param('questionId') questionId: number,
    @Param('choiceId') choiceId: number,
    @Body() dto: UpdateAnswerChoiceDto,
  ) {
    return new AnswerEntity(
      await this.surveysService.updateAnswerChoice(choiceId, dto),
    );
  }

  @Delete(':id/questions/:questionId/answerChoices/:choiceId')
  @ApiOkResponse({
    type: AnswerEntity,
  })
  @CacheInvalidate(...SurveysController.cacheInvalidateOnSurveyUpdate)
  async deleteQuestionAnswerChoice(
    @Param('id') id: number,
    @Param('questionId') questionId: number,
    @Param('choiceId') choiceId: number,
  ) {
    return new AnswerEntity(
      await this.surveysService.deleteAnswerChoice(choiceId),
    );
  }
  //#endregion
}
