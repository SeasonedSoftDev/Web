import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  @IsPositive()
  chatRoomId: number;

  @IsInt()
  @IsPositive()
  authorId: number;

  @IsString()
  message: string;
}
