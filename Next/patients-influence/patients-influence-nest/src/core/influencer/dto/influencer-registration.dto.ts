import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { nameRegex, passwordRegex } from '../../../utils';

export class InfluencerRegistrationDto {
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
  commonLegalId: number;

  @IsNotEmpty()
  @IsNumber()
  patientSpecificLegalId: number;
}
