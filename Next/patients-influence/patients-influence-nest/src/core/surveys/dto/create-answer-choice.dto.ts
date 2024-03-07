import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAnswerChoiceDto {
  @IsString()
  @IsOptional()
  answer?: string;

  // TODO review
  /* @IsString()
  @IsOptional()
  answerInfo?: string; */

  @IsBoolean()
  @IsOptional()
  isOther?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}
