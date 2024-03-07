import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserStatus } from 'src/utils';

export enum DiscoverClientStage {
  Identified = 'identified',
  Contacted = 'contacted',
  Registered = 'registered',
  Scheduled = 'scheduled',
}

export enum PropertySelector {
  FirstName = 'firstName',
  LastName = 'lastName',
  Email = 'email',
  RegisteredAt = 'registeredAt',
  UpdatedAt = 'updatedAt',
  Labels = 'labels',
  Ambassador = 'ambassador',
  Company = 'company',
  Industry = 'industry',
  Products = 'products',
  Location = 'location',
  Markets = 'markets',
  DiseaseAreas = 'diseaseAreas',
  Role = 'role',
  // TODO finish
}

export class DiscoverClientsFilterDto {
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
  @IsBoolean()
  @Transform(({ obj }) => (obj.hasAmbassador === 'true' ? true : false))
  hasAmbassador?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  companyIds?: number[];

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsNotEmpty()
  @IsEnum(DiscoverClientStage)
  stage: DiscoverClientStage;

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

  /* @IsOptional()
  @IsArray()
  @IsEnum(PropertySelector, { each: true })
  selectProperties?: PropertySelector[]; */
}
