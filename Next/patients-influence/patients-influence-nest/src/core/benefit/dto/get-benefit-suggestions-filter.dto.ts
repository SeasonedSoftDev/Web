import { IsEnum, IsOptional } from 'class-validator';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { SuggestionStatus } from '../enums/suggestions-status.enum';

export class GetBenefitSuggestionsFilterDto extends FilterParamsDto {
  @IsEnum(SuggestionStatus)
  @IsOptional()
  status?: SuggestionStatus;
}
