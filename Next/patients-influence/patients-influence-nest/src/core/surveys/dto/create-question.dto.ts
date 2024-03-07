import { QuestionType } from '../enums/question-type.enum';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateAnswerChoiceDto } from './create-answer-choice.dto';

export class CreateQuestionDto {
  @IsString()
  @IsOptional()
  questionText?: string;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  questionType: QuestionType;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsNumber()
  @IsOptional()
  questionCredit?: number;

  @IsBoolean()
  @IsOptional()
  isOptional?: boolean;

  @IsArray()
  @IsOptional()
  answers?: CreateAnswerChoiceDto[];
}
