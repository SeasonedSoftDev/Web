import { PaginationParamsDto } from 'src/utils/object-definitions/dtos/pagination-params.dto';
import { NPointGraphParamsDto } from '../../dto/graph-params.dto';
import { mix } from 'ts-mixer';

export interface SMLGraphParamsDto
  extends PaginationParamsDto,
    NPointGraphParamsDto {}

@mix(PaginationParamsDto, NPointGraphParamsDto)
export class SMLGraphParamsDto {}
