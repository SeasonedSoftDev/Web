import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubmitSurveyResultDto {
  @IsInt()
  @IsNotEmpty()
  surveyQuestionId: number;

  @IsInt()
  @IsOptional()
  surveyOptionId?: number;

  @IsString()
  @IsOptional()
  surveyResponseText?: string;
}
