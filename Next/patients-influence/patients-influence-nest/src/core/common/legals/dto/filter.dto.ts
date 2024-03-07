import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.newestOnly === 'true' ? true : false))
  newestOnly?: boolean = false;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  legalIds?: number[];
}
