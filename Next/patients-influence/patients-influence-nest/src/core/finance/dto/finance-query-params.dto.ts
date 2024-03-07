import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import FinanceSelectors from '../selectors';
import { PaginationParamsDto } from 'src/utils/object-definitions/dtos/pagination-params.dto';
import { Type } from 'class-transformer';

const financeSelectorKeys = FinanceSelectors.map((s) => s.key);

export class FinanceFilterParamsDto {
  @IsString()
  @IsOptional()
  search?: string = '';

  // @IsOptional()
  // @IsArray()
  // @Type(() => Number)
  // @IsInt({ each: true })
  // companyTitles?: number[] = [];

  // @IsInt()
  // @ValidateIf((object, value) => value !== null)
  // @IsOptional()
  // projectStatus?: number | null = null;

  // @IsDate()
  // @ValidateIf((object, value) => value !== null)
  // @IsOptional()
  // joinedAfter?: Date | null = null;
}

export class FinanceQueryParamsDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => FinanceFilterParamsDto)
  filters: FinanceFilterParamsDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PaginationParamsDto)
  pagination: PaginationParamsDto;

  @IsArray()
  @ArrayMinSize(1)
  @IsIn(financeSelectorKeys, { each: true })
  columns: string[];
}
