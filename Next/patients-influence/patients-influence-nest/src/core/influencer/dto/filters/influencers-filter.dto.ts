import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
// import { UserStatus } from 'src/utils';
import { InfluencerType } from '../../enums/influencer-type.enum';
import { FilterUnit } from 'src/utils';

export class InfluencersFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(InfluencerType)
  experienceAsId?: InfluencerType;

  /* @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsString()
  stage?: 'registered' | 'toBeApproved'; */

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  ethnicityIds?: number[];

  @IsOptional()
  @IsNumber()
  followersMin?: number;

  @IsOptional()
  @IsNumber()
  followersMax?: number;

  @IsOptional()
  @IsNumber()
  engagementMin?: number;

  @IsOptional()
  @IsNumber()
  engagementMax?: number;

  @IsOptional()
  @IsNumber()
  likesMin?: number;

  @IsOptional()
  @IsNumber()
  likesMax?: number;

  @IsOptional()
  @IsNumber()
  commentsMin?: number;

  @IsOptional()
  @IsNumber()
  commentsMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  diseaseAreaIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  symptomsIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  struggleIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  locationIds?: number[];

  @IsOptional()
  @IsNumber()
  ageMin?: number;

  @IsOptional()
  @IsNumber()
  ageMax?: number;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  languageIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  genderIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  stakeholderIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  audienceGenderChoiceIds?: number[];

  @IsOptional()
  @IsNumber()
  audienceGenderCount?: number;

  @IsOptional()
  @IsEnum(FilterUnit)
  audienceGenderUnitId?: FilterUnit;

  @IsOptional()
  @IsNumber()
  audienceAgeMin?: number;

  @IsOptional()
  @IsNumber()
  audienceAgeMax?: number;

  @IsOptional()
  @IsNumber()
  audienceAgeCount?: number;

  @IsOptional()
  @IsEnum(FilterUnit)
  audienceAgeUnitId?: FilterUnit;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  audienceEthnicityChoiceIds?: number[];

  @IsOptional()
  @IsNumber()
  audienceEthnicityCount?: number;

  @IsOptional()
  @IsEnum(FilterUnit)
  audienceEthnicityUnitId?: FilterUnit;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  audienceLocationChoiceIds?: number[];

  @IsOptional()
  @IsNumber()
  audienceLocationCount?: number;

  @IsOptional()
  @IsEnum(FilterUnit)
  audienceLocationUnitId?: FilterUnit;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  audienceDiseaseAreaChoiceIds?: number[];

  @IsOptional()
  @IsNumber()
  audienceDiseaseAreaCount?: number;

  @IsOptional()
  @IsEnum(FilterUnit)
  audienceDiseaseAreaUnitId?: FilterUnit;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  audienceLanguageChoiceIds?: number[];

  @IsOptional()
  @IsNumber()
  audienceLanguageCount?: number;

  @IsOptional()
  @IsEnum(FilterUnit)
  audienceLanguageUnitId?: FilterUnit;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  audienceStruggleChoiceIds?: number[];

  @IsOptional()
  @IsNumber()
  audienceStruggleCount?: number;

  @IsOptional()
  @IsEnum(FilterUnit)
  audienceStruggleUnitId?: FilterUnit;

  // @IsOptional()
  // @Type(() => Number)
  // @IsArray()
  // labelIds?: number[];

  // @IsOptional()
  // @IsBoolean()
  // @Transform(({ obj }) => (obj.hasLabel === 'true' ? true : false))
  // hasLabel?: boolean;

  // @IsOptional()
  // @Type(() => Number)
  // @IsArray()
  // scheduleIds?: number[];

  // @IsOptional()
  // @IsBoolean()
  // @Transform(({ obj }) => (obj.hasSchedule === 'true' ? true : false))
  // hasSchedule?: boolean;

  // @IsOptional()
  // @IsNumber()
  // socialMediaId?: number;

  @IsOptional()
  @IsDate()
  joinedFrom?: Date;

  @IsOptional()
  @IsDate()
  joinedTo?: Date;

  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @IsString()
  audienceKeywords?: string;

  @IsOptional()
  @IsNumber()
  performancePostTypeId?: number;

  @IsOptional()
  @IsNumber()
  costPerTargetMin?: number;

  @IsOptional()
  @IsNumber()
  costPerTargetMax?: number;

  @IsOptional()
  @IsNumber()
  costPerQuestionCreditMin?: number;

  @IsOptional()
  @IsNumber()
  costPerQuestionCreditMax?: number;

  @IsOptional()
  @IsNumber()
  costPerLikeMin?: number;

  @IsOptional()
  @IsNumber()
  costPerLikeMax?: number;

  @IsOptional()
  @IsNumber()
  costPerCommentMin?: number;

  @IsOptional()
  @IsNumber()
  costPerCommentMax?: number;

  @IsOptional()
  @IsNumber()
  costPerEngagementMin?: number;

  @IsOptional()
  @IsNumber()
  costPerEngagementMax?: number;

  @IsOptional()
  @IsNumber()
  totalEarningsMin?: number;

  @IsOptional()
  @IsNumber()
  totalEarningsMax?: number;

  @IsOptional()
  @IsNumber()
  earningsLast30DaysMin?: number;

  @IsOptional()
  @IsNumber()
  earningsLast30DaysMax?: number;

  @IsOptional()
  @IsNumber()
  totalProjectsMin?: number;

  @IsOptional()
  @IsNumber()
  totalProjectsMax?: number;

  @IsOptional()
  @IsNumber()
  projectsLast30DaysMin?: number;

  @IsOptional()
  @IsNumber()
  projectsLast30DaysMax?: number;

  @IsOptional()
  @IsNumber()
  influencersNeeded?: number;

  @IsOptional()
  @IsNumber()
  audienceOverlap?: number;

  @IsOptional()
  @IsString()
  prioritizeBy?: string;
}
