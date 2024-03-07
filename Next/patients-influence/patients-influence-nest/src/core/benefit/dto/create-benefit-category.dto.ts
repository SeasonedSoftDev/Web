import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBenefitCateogryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
