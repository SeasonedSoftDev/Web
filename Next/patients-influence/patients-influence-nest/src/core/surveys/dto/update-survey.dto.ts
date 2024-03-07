import { PartialType } from '@nestjs/swagger';
import { CreateSurveyDto } from './create-survey.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSurveyDto extends PartialType(CreateSurveyDto) {
  /* @IsBoolean()
  @IsOptional()
  isContractApproved?: boolean; */

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsNumber()
  @IsOptional()
  clientUserId?: number;
}
