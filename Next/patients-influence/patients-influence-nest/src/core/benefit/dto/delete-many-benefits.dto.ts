import { IsArray, IsInt } from 'class-validator';

export class DeleteManyBenefitsDto {
  @IsArray()
  @IsInt({ each: true })
  benefitIds: number[];
}
