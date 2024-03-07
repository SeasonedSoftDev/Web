import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { TransactionFlowType } from '../../../utils';
import { Decimal } from '@prisma/client/runtime';

export class CreateTransactionFlowDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  productOrderId?: number;

  @IsNumber()
  @IsPositive()
  amount: Decimal;

  @IsInt()
  @IsPositive()
  @IsIn(
    Object.keys(TransactionFlowType)
      .map((x) => parseInt(x))
      .filter((x) => !isNaN(x)),
  )
  type: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  userId: number;
}
