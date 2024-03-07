import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @ApiPropertyOptional({
    description: 'File name',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
