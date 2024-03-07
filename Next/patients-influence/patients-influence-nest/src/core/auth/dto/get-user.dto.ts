import { IsInt } from 'class-validator';

export class getUserByIdDto {
  @IsInt()
  userId: number;
}
