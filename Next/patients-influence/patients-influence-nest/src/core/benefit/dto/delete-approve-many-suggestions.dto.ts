import { IsArray, IsInt } from 'class-validator';

export class DeleteApproveManySuggestionsDto {
  @IsArray()
  @IsInt({ each: true })
  suggestionIds: number[];
}
