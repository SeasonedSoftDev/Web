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
import ClientSelectors from '../selectors';
import { PaginationParamsDto } from 'src/utils/object-definitions/dtos/pagination-params.dto';
import { Type } from 'class-transformer';

const clientSelectorKeys = ClientSelectors.map((s) => s.key);

export class ClientsFilterParamsDto {
  @IsString()
  @IsOptional()
  search?: string = '';

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  companyTitles?: number[] = [];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  markets?: number[] = [];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  industries?: number[] = [];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  products?: number[] = [];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  ambassadors?: number[] = [];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  companies?: number[] = [];

  @IsInt()
  @ValidateIf((object, value) => value !== null)
  @IsOptional()
  projectStatus?: number | null = null;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  diseaseAreas?: number[] = [];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  labels?: number[] = [];

  @IsDate()
  @ValidateIf((object, value) => value !== null)
  @IsOptional()
  joinedBefore?: Date | null = null;

  @IsDate()
  @ValidateIf((object, value) => value !== null)
  @IsOptional()
  joinedAfter?: Date | null = null;
}

export class ClientsQueryParamsDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ClientsFilterParamsDto)
  filters: ClientsFilterParamsDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PaginationParamsDto)
  pagination: PaginationParamsDto;

  @IsArray()
  @ArrayMinSize(1)
  @IsIn(clientSelectorKeys, { each: true })
  columns: string[];
}
