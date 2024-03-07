import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateChatRoomDto {
  @IsInt()
  productOrderId: number;

  @IsOptional()
  @IsBoolean()
  isGroupRoom: boolean;

  @ApiProperty({
    description:
      'The chat interlocutor, if null then isGroupRoom must be false',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  productOrderChatRoomMember?: number;
}
