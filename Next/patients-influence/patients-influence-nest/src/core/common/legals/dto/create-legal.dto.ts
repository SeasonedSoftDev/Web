import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { Legal } from '../enums/legal.enum';

export class CreateLegalDto {
  @IsEnum(Legal)
  @IsNotEmpty()
  type: Legal;

  @IsInt()
  @IsPositive()
  version: number;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  language: 'en' | 'de';
}
