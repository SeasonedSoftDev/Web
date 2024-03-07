import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetCostsFilteredDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  budgetMin?: number;

  @IsOptional()
  @IsNumber()
  budgetMax?: number;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  statusIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  companyIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  clientIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  influencerIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  ambassadorIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  campaignIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  surveyIds?: number[];
}
