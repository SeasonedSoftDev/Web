import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

export class BenefitPartnershipDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  id?: number;
}

export class CreateBenefitDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BenefitPartnershipDto)
  benefitPartnership: BenefitPartnershipDto;

  @IsString()
  @IsOptional()
  benefitCompanyLink?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsPositive()
  benefitCategoryId: number;

  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsArray()
  benefitLocations?: number[];
}
