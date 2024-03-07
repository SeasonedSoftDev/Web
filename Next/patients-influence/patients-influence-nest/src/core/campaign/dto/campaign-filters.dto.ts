import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
export class CampaignSimpleFiltersDto {
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  search?: string[];

  @IsOptional()
  @IsInt()
  @IsPositive()
  budgetMin?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  budgetMax?: number;

  @IsOptional()
  @IsDate()
  startDateBegin?: Date;

  @IsOptional()
  @IsDate()
  startDateEnd?: Date;

  @IsOptional()
  @IsDate()
  endDateBegin?: Date;

  @IsOptional()
  @IsDate()
  endDateEnd?: Date;

  @IsOptional()
  @IsInt()
  @IsPositive()
  influencersMin?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  influencersMax?: number;

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  influencerSizes?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  socialMedias?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  postTypes?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  reports?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  labels?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  schedules?: number[];
}

export class ClientSimpleFiltersDto {
  @IsOptional()
  @IsInt({ each: true })
  @IsInt({ each: true })
  campaignIds?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  industries?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  companies?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  clients?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  ambassadors?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  products?: number[];
}

export class TargetSimpleFiltersDto {
  @IsOptional()
  @IsInt({ each: true })
  @IsInt({ each: true })
  campaignIds?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  diseaseAreas?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  struggles?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  locations?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  ethnicities?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  interests?: number[];

  @IsOptional()
  @IsInt()
  @IsPositive()
  ageMin?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  ageMax?: number;

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  genders?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  languages?: number[];
}

export class CampaignFiltersDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CampaignSimpleFiltersDto)
  campaignFilters?: CampaignSimpleFiltersDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ClientSimpleFiltersDto)
  clientFilters?: ClientSimpleFiltersDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TargetSimpleFiltersDto)
  targetFilters?: TargetSimpleFiltersDto;
}
