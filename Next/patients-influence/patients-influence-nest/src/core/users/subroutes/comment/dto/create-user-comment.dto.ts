import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe did great in campaigns.' })
  comment: string;
}
