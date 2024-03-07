import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
