import { Decimal } from '@prisma/client/runtime';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { TransactionFlowType, TransactionStatus } from 'src/utils';

export class CreateCustomFinanceStatementDto {
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  productOrderId: number;

  @IsNotEmpty()
  @IsString()
  statementName: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  amount: Decimal;

  @IsEnum(TransactionFlowType)
  @IsOptional()
  type?: TransactionFlowType;

  @IsOptional()
  @IsString()
  vendor?: string;

  @IsNotEmpty()
  @IsDate()
  statementDate: Date;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsBoolean()
  isBalanceChange?: boolean;

  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}
