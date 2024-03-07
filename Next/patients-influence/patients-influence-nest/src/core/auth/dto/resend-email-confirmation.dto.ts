import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendEmailConfirmationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
