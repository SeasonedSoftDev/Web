import { IsArray, IsOptional } from 'class-validator';
import { GetCostsFilteredDto } from './get-costs-filtered.dto';
import { Type } from 'class-transformer';

export class CustomCostFilterDto extends GetCostsFilteredDto {
  @IsArray()
  @Type(() => Number)
  @IsOptional()
  typeIds?: number[];
}
