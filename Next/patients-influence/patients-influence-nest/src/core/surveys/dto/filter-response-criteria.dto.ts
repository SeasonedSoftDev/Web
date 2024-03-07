import { IsOptional, IsInt } from 'class-validator';

export class FilterResponseCriteriaDto {
  @IsOptional()
  @IsInt()
  influencerId?: number;
}
