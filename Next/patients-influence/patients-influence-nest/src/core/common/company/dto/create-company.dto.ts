import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isCommon?: boolean;
}
