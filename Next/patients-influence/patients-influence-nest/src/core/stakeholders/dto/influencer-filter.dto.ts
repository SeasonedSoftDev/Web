import { InfluencerStakeholderFiltersDto } from '.';
import { FollowerStakeholderFiltersDto } from './follower-stakeholder-filters.dto';
import { Type } from 'class-transformer';
import { PerformanceStakeholderFiltersDto } from './performance-stakeholder-filters.dto';
import { IsObject, ValidateNested } from 'class-validator';

export class InfluencerFilterDto {
  @IsObject()
  @ValidateNested()
  @Type(() => InfluencerStakeholderFiltersDto)
  influencerStakeholderFilters: InfluencerStakeholderFiltersDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FollowerStakeholderFiltersDto)
  followerStakeholderFilters: FollowerStakeholderFiltersDto;

  @IsObject()
  @ValidateNested()
  @Type(() => PerformanceStakeholderFiltersDto)
  performanceStakeholderFilters: PerformanceStakeholderFiltersDto;
}
