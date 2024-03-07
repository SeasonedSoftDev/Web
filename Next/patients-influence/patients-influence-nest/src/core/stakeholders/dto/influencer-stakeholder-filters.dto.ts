import { IntersectionType } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class InfluencerStakeholderAggregateFiltersDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  engagementMin?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  engagementMax?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  commentsMin?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  commentsMax?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  likesMin?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  likesMax?: number;
}

export class InfluencerStakeholderSimpleFiltersDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  search?: string;

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  ethnicities?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  brands?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  struggles?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  interests?: number[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  keywords?: string[];

  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  languages?: string[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  products?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  diseaseAreas?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  locations?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  genders?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  experienceAs?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  labels?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  schedules?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  socialMedias?: number[];

  @IsOptional()
  @IsDate()
  joinedStart?: Date;

  @IsOptional()
  @IsDate()
  joinedEnd?: Date;

  @IsOptional()
  @IsInt()
  @IsPositive()
  ageMin?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  ageMax?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  followersMin?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  followersMax?: number;
}

export class InfluencerStakeholderColumnsDto {}

export class InfluencerStakeholderFiltersDto extends IntersectionType(
  InfluencerStakeholderSimpleFiltersDto,
  InfluencerStakeholderAggregateFiltersDto,
) {
  @IsOptional()
  columns?: InfluencerStakeholderColumnsDto;
}
