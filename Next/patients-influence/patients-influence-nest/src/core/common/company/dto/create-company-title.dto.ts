import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyTitleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
