import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class DiseaseAreaDto {
  @IsString()
  @IsNotEmpty()
  disease: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  parentDiseaseAreaId?: number;

  @IsOptional()
  @IsBoolean()
  isCommon?: boolean;
}
