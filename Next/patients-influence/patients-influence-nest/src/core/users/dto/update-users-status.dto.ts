import { IsInt, IsArray } from 'class-validator';

export class UpdateUsersStatusDto {
  @IsInt()
  status: number;

  @IsArray()
  @IsInt({ each: true })
  userIds: number[];
}
