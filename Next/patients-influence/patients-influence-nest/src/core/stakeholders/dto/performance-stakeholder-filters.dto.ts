import { IntersectionType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPort, IsPositive } from 'class-validator';
export class PerformanceStakeholderSimpleFiltersDto {
  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  projects?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  postType?: number[];
}
export class PerformanceStakeholderAggregateFiltersDto {
  costPerClickMin?: number;

  costPerClickMax?: number;

  costPerTargetMin?: number;

  costPerTargetMax?: number;

  costPerQuestionCreditMin?: number;

  costPerQuestionCreditMax?: number;

  reachMultiplierMin?: number;

  reachMultiplierMax?: number;

  costPerLikeMin?: number;

  costPerLikeMax?: number;

  costPerCommentMin?: number;

  costPerCommentMax?: number;

  costPerEngagementMin?: number;

  costPerEngagementMax?: number;

  totalEarningsMin?: number;

  totalEarningsMax?: number;

  earningsLast30DaysMin?: number;

  earningsLast30DaysMax?: number;

  totalProjectsMin?: number;

  totalProjectsMax?: number;

  projectsLast30DaysMin?: number;

  projectsLast30DaysMax?: number;

  totalCampaignsMin?: number;

  totalCampaignsMax?: number;

  campaingsLast30DaysMin?: number;

  campaingsLast30DaysMax?: number;

  totalSurveysMin?: number;

  totalSurveysMax?: number;

  surveysLast30DaysMin?: number;

  surveysLast30DaysMax?: number;
}

export class PerformanceStakeholderFiltersDto extends IntersectionType(
  PerformanceStakeholderSimpleFiltersDto,
  PerformanceStakeholderAggregateFiltersDto,
) {
  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  stakeholders?: number[];
}
