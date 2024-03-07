import { IsNotEmpty, IsString } from 'class-validator';

export class EditBenefitCateogryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
