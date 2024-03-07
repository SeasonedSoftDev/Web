import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Status } from '../enums';
import { Transform, Type } from 'class-transformer';
import { PostType } from 'src/core/influencer/subroutes/desired-income/campaign/enums/post-type.enum';

export class CampaignFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(Number);
    }
    return value;
  })
  status?: Status[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.withNoReportOnly === 'true' ? true : false))
  withNoReportOnly?: boolean;

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
  influencersMin?: number;

  @IsOptional()
  @IsNumber()
  influencersMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  influencersSizeIds?: number[];

  @IsOptional()
  @IsEnum(PostType)
  postType?: PostType;

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  clientIndustryIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  clientDiseaseAreaIds?: number[];

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
