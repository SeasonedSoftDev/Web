import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReportType } from '../enums';
import { Decimal } from '@prisma/client/runtime';

export class UpdateReportDto {
  @IsEnum(ReportType)
  @IsNotEmpty()
  reportType: ReportType;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  budget?: Decimal;

  @IsString()
  @IsOptional()
  description?: string;
}
