import { IsInt, IsPositive } from 'class-validator';

export class JoinRoomDto {
  @IsInt()
  @IsPositive()
  chatRoomId: number;
}
