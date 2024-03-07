import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsJWT, IsNotEmpty, Matches } from 'class-validator';
import { passwordRegex } from 'src/utils';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordConfirmDto {
  @ApiProperty({
    example: 'sDc34234.$!$d',
  })
  @IsNotEmpty()
  @Matches(passwordRegex)
  password: string;

  @IsNotEmpty()
  @IsJWT()
  token: string;
}
