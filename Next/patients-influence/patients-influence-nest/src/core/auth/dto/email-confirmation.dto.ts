import { IsJWT, IsNotEmpty } from 'class-validator';

export class EmailConfirmationDto {
  @IsJWT()
  @IsNotEmpty()
  token: string;
}
