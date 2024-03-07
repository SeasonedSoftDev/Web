import { IsInt, IsArray } from 'class-validator';

export class DeleteManySMLsDto {
  @IsArray()
  @IsInt({ each: true })
  smlIds: number[];
}
