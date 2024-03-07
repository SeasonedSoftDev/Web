import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductOrderCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Was going smooth.' })
  comment: string;
}
