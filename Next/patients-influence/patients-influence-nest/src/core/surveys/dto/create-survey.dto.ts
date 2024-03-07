import { Decimal } from '@prisma/client/runtime';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SurveyType } from '../enums/survey-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from 'src/core/users/enums/gender';
import { Language } from 'src/core/platform-product/enums/language.enum';

export class CreateSurveyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  clientUserId?: number;

  // * ambassador is auto-included when a client is set

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  budget?: Decimal;

  @IsNumber()
  @IsOptional()
  currencyId?: number;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  diseaseAreaIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  struggleIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  symptomIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  locationIds?: number[];

  @IsNumber()
  @IsOptional()
  languageId?: number;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  ethnicityIds?: number[]; // ! converted from 1 to n

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  interestIds?: number[];

  @IsArray()
  @IsOptional()
  productIds?: Array<string | number>;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  stakeholderTypes?: number[];

  @IsDate()
  @IsOptional()
  dateStart?: Date;

  @IsDate()
  @IsOptional()
  dateEnd?: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  participantsCount?: number;

  @IsNumber()
  @IsOptional()
  questionsCount?: number;

  @IsNumber()
  @IsOptional()
  ageMin?: number;

  @IsNumber()
  @IsOptional()
  ageMax?: number;

  @IsArray()
  // @Type(() => Number)
  @IsEnum(Gender, { each: true })
  @IsOptional()
  genders?: Gender[];

  @IsString()
  @IsOptional()
  participantsDescription?: string;

  @IsEnum(SurveyType)
  @IsOptional()
  surveyType?: SurveyType;

  // TODO @IsUrl()
  @IsArray()
  @Type(() => String)
  @IsOptional()
  exampleImageUrls?: string[];

  @IsString()
  @IsOptional()
  instructions?: string;

  // TODO review
  @ApiProperty({
    description:
      'Monthly token that selected package provides. Eg.:100, 200...',
  })
  @IsInt()
  // @Min(0)
  @IsOptional()
  tokens: number;

  @IsNumber()
  @IsOptional()
  questionCredits?: number;

  @IsString()
  @IsOptional()
  link?: string;

  @IsEnum(Language, { each: true })
  @IsOptional()
  languages?: Language[];
}
