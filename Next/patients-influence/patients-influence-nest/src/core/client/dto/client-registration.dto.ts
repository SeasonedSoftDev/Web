import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { nameRegex, passwordRegex } from '../../../utils';
import { Type } from 'class-transformer';

export class CompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsPositive()
  @IsInt()
  companyId?: number;
}

export class ClientRegistrationDto {
  @IsString()
  @MaxLength(30)
  @Matches(nameRegex)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MaxLength(30)
  @Matches(nameRegex)
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Matches(passwordRegex)
  password: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  companyTitleId: number;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;

  @IsNotEmpty()
  @IsNumber()
  commonLegalId: number;
}
