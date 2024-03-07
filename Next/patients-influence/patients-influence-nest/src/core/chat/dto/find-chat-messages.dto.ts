import { IsInt, IsPositive, Min } from 'class-validator';

export class FindChatMessagesByChatRoomIdDto {
  @IsInt()
  @IsPositive()
  chatRoomId: number;

  @IsInt()
  @Min(0)
  page: number;
}
