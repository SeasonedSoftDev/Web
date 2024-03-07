import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CompanyDto } from './client-registration.dto';
import { ClientProductDto } from './client-products.dto';
import { nameRegex } from 'src/utils';

export class CreateDiscoverClientDto {
  @IsString()
  @MaxLength(30)
  @Matches(nameRegex)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MaxLength(30)
  @Matches(nameRegex)
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CompanyDto)
  company?: CompanyDto;

  @IsNumber()
  @IsOptional()
  companyTitleId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientProductDto)
  clientProducts?: ClientProductDto[];

  @IsNumber()
  @IsOptional()
  industryId?: number;

  @IsNumber()
  @IsOptional()
  locationId?: number;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  marketIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  diseaseAreaIds?: number[];
}
