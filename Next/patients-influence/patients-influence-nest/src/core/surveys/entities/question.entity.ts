import { SurveyQuestion } from '@prisma/client';
import { Transform } from 'class-transformer';
import { AnswerEntity } from './answer.entity';

export class QuestionEntity implements SurveyQuestion {
  id: number;
  surveyId: number;
  questionText: string;
  questionType: number;
  order: number;
  questionCredit: number;
  isOptional: boolean;
  createdAt: Date;
  updatedAt: Date;

  @Transform(({ value }) => value.map((item) => new AnswerEntity(item)))
  surveyOptions?: AnswerEntity[];

  constructor({ surveyOptions, ...data }: Partial<QuestionEntity>) {
    Object.assign(this, data);

    if (surveyOptions) this.surveyOptions = surveyOptions;
  }
}
