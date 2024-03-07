import { Decimal } from '@prisma/client/runtime';
import { ReportType } from '../enums/report.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class OrderReportDto {
  @IsNumber()
  @IsNotEmpty()
  campaignId: number;

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

  @IsNumber()
  @IsOptional()
  currency?: number;

  // * admin ONLY can touch these
  /* reach?: boolean;
  numOfLikes?: boolean;
  numOfComments?: boolean; */
  websiteClicks?: boolean;
  engagement?: boolean;
  costPerClick?: boolean;
  costPerLike?: boolean;
  costPerComment?: boolean;
  costPerEngagement?: boolean;
  overlap?: boolean;
}
