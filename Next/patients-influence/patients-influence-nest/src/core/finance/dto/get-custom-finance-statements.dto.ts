import { IsOptional } from 'class-validator';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';

export class GetCustomFinanceStatementsFilterDto extends FilterParamsDto {
  @IsOptional()
  type?: number;
}
