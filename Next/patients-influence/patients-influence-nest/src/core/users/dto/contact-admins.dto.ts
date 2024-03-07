import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ContactAdminsDto {
  @IsString()
  @IsOptional()
  topic?: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
