import { IntersectionType } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FollowerStakeholderAggregateFiltersDto {
  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Max(1)
  @Min(0)
  stakeholderTypeRelativeMin?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  stakeholderTypeAbsoluteMin?: number;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Max(1)
  @Min(0)
  ethnicitiesRelativeMin?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  ethnicitiesAbsoluteMin?: number;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Max(1)
  @Min(0)
  brandsRelativeMin?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  brandsAbsoluteMin?: number;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Max(1)
  @Min(0)
  strugglesRelativeMin?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  strugglesAbsoluteMin?: number;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Max(1)
  @Min(0)
  interestsRelativeMin?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  interestsAbsoluteMin?: number;
}

export class FollowerStakeholderSimpleFiltersDto {
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
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
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
  experienceAs?: number[];
}

export class FollowerStakeholderFiltersDto extends IntersectionType(
  FollowerStakeholderSimpleFiltersDto,
  FollowerStakeholderAggregateFiltersDto,
) {
  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  stakeholders?: number[];
}
