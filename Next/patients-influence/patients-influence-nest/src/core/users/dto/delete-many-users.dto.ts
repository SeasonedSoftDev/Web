import { IsInt, IsArray } from 'class-validator';

export class DeleteManyUsersDto {
  @IsArray()
  @IsInt({ each: true })
  userIds: number[];
}
