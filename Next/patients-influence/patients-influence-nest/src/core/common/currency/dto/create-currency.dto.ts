import {
  IsCurrency,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  @IsNotEmpty()
  @IsISO4217CurrencyCode()
  code: string;
}
