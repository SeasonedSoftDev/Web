import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Status } from 'src/core/campaign/enums';
import { UserStatus } from 'src/utils/enums';
import { PlatformProduct } from 'src/utils/enums/platform.product.enum';

export class AmbassadorFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  // company title IDs
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  roleIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  marketIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  industryIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  productIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  ambassadorIds?: number[];

  @IsOptional()
  @IsString()
  @Transform(({ obj }) => (obj.hasAmbassador === 'true' ? true : false))
  hasAmbassador?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  companyIds?: number[];

  @IsOptional()
  @IsEnum(Status)
  projectStatus?: Status;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  diseaseAreaIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  locationIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  labelIds?: number[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.hasLabel === 'true' ? true : false))
  hasLabel?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  scheduleIds?: number[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.hasSchedule === 'true' ? true : false))
  hasSchedule?: boolean;

  @IsOptional()
  @IsDate()
  joinedFrom?: Date;

  @IsOptional()
  @IsDate()
  joinedTo?: Date;

  @IsOptional()
  @IsNumber()
  commissionMin?: number;

  @IsOptional()
  @IsNumber()
  commissionMax?: number;

  @IsOptional()
  @IsEnum(PlatformProduct)
  project?: PlatformProduct;

  @IsOptional()
  @IsNumber()
  totalProjectsMin?: number;

  @IsOptional()
  @IsNumber()
  totalProjectsMax?: number;

  @IsOptional()
  @IsNumber()
  projectsLast30DaysMin?: number;

  @IsOptional()
  @IsNumber()
  projectsLast30DaysMax?: number;

  @IsOptional()
  @IsNumber()
  clientsMin?: number;

  @IsOptional()
  @IsNumber()
  clientsMax?: number;
}
