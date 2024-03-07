import { mix } from 'ts-mixer';
import { PaginationParamsDto } from './pagination-params.dto';
import { SortParamDto } from './sort-param.dto';
import { SearchParamDto } from './search-param.dto';

export interface FilterParamsDto<T = void>
  extends PaginationParamsDto,
    SortParamDto<T>,
    SearchParamDto {}

@mix(PaginationParamsDto, SortParamDto, SearchParamDto)
export class FilterParamsDto<T> {}
