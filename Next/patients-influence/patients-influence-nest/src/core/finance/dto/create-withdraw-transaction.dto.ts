import { Decimal } from '@prisma/client/runtime';
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateWithdrawTransactionDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  bankAccountFirstName: string;

  @IsString()
  @IsNotEmpty()
  bankAccountLastName: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  bankAddress: string;

  @IsString()
  @IsOptional()
  iban?: string;

  @IsString()
  @IsOptional()
  swiftBic?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
