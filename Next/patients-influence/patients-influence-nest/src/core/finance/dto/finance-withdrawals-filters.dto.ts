import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class FinanceWithdrawalsFiltersDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  amountMin?: number;

  @IsOptional()
  @IsNumber()
  amountMax?: number;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  statusIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  influencerIds?: number[];
}
