import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class TypingDto {
  @IsBoolean()
  isTyping: boolean;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsInt()
  @IsPositive()
  chatRoomId: number;
}
