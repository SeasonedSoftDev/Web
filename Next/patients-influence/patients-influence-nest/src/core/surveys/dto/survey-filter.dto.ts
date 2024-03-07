import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Status } from 'src/core/campaign/enums';
import { SurveyType } from '../enums/survey-type.enum';

export class SurveyFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(Number);
    }
    return value;
  })
  status?: Status[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  budgetMin?: number;

  @IsOptional()
  @IsNumber()
  budgetMax?: number;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  participantsMin?: number;

  @IsOptional()
  @IsNumber()
  participantsMax?: number;

  @IsOptional()
  @IsNumber()
  questionsMin?: number;

  @IsOptional()
  @IsNumber()
  questionsMax?: number;

  @IsOptional()
  @IsNumber()
  questionCreditMin?: number;

  @IsOptional()
  @IsNumber()
  questionCreditMax?: number;

  @IsOptional()
  @IsEnum(SurveyType)
  surveyType?: SurveyType;

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  clientIndustryIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  clientCompanyIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  clientIds?: number[];

  @IsOptional()
  @IsNumber()
  ambassadorId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  productIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  targetDiseaseAreaIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  targetStruggleIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  targetLocationIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  targetEthnicityIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  targetInterestIds?: number[];

  @IsOptional()
  @IsNumber()
  targetAgeMin?: number;

  @IsOptional()
  @IsNumber()
  targetAgeMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  targetGenderIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  targetLanguageIds?: number[];
}
