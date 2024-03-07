import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { nameRegex, passwordRegex } from '../../../utils';
import { Type } from 'class-transformer';

class CompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  companyId?: number;
}

export class AmbassadorRegistrationDto {
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(nameRegex)
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @MaxLength(30)
  @Matches(nameRegex)
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(passwordRegex)
  password: string;

  @IsNotEmpty()
  @IsNumber()
  companyTitleId: number;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  commonLegalId: number;
}
