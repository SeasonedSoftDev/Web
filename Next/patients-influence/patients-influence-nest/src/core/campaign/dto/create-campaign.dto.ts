import { Decimal } from '@prisma/client/runtime';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { PostType } from 'src/core/influencer/subroutes/desired-income/campaign/enums/post-type.enum';
import { ReportType as Report } from '../enums/report.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from 'src/core/users/enums/gender';
import { Language } from 'src/core/platform-product/enums/language.enum';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  clientId?: number;

  // * ambassador is auto-included when a client is set
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  budget?: Decimal;

  @IsNumber()
  @IsOptional()
  currencyId?: number;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  diseaseAreaIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  stakeholderTypes?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  struggleIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  symptomIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  locationIds?: number[];

  @IsEnum(Language, { each: true })
  @IsOptional()
  languages?: Language[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  ethnicityIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  interestIds?: number[];

  @IsArray()
  @IsOptional()
  productIds?: Array<string | number>;

  @IsDate()
  @IsOptional()
  dateStart?: Date;

  @IsDate()
  @IsOptional()
  dateEnd?: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  influencersCount?: number;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  influencersSizeIds?: number[];

  @IsNumber()
  @IsOptional()
  ageMin?: number;

  @IsNumber()
  @IsOptional()
  ageMax?: number;

  @IsArray()
  // @Type(() => Number)
  @IsEnum(Gender, { each: true })
  @IsOptional()
  genders?: Gender[];

  @IsString()
  @IsOptional()
  targetAudienceDescription?: string;

  @IsNumber()
  @IsOptional()
  socialPlatformId?: number;

  @IsEnum(PostType)
  @IsOptional()
  postType?: PostType;

  // TODO @IsUrl()
  @IsArray()
  @Type(() => String)
  @IsOptional()
  @IsUrl(undefined, { each: true })
  exampleImageUrls?: string[];

  @IsString()
  @IsOptional()
  clientCompanyWebsite?: string;

  @IsString()
  @IsOptional()
  instructions?: string;

  @IsEnum(Report)
  @IsOptional()
  report?: Report;
}
