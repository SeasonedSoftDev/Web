import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class FilterParamsDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.includeDeleted === 'true' ? true : false))
  includeDeleted?: boolean = false;
}
