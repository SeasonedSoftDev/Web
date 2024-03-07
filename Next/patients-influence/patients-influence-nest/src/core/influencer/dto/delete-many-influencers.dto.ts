import { IsInt, IsArray } from 'class-validator';

export class DeleteManyInfluencersDto {
  @IsArray()
  @IsInt({ each: true })
  userIds: number[];
}
