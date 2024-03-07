import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  Influencer,
  InfluencerCampaignAmount,
  InfluencerSurveyAmount,
  SocialPlatform,
  User,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { nameRegex, passwordRegex } from 'src/utils';
import { InfluencerType } from '../enums/influencer-type.enum';
import { Gender } from 'src/core/users/enums/gender';
import { StakeholderTypeEntity } from 'src/core/campaign/entities/campaign.entity';

export class InfluencerSocialPlatformDto {
  @ApiProperty({
    description: 'An ID of the social platform for which vendor ID is.',
  })
  @IsNumber()
  socialPlatformId: number;

  /* @ApiProperty({
    description:
      'An ID of an user on the social platform. This is an ID by which that platform tracks its users.',
  })
  @IsString()
  vendorId: string; */
  @ApiPropertyOptional({
    description:
      'An OAuth 2.0 flow that enables clients to obtain an access token on behalf of a user by having the user authenticate and grant authorization to the client.',
  })
  @IsString()
  @IsOptional()
  authorizationCode?: string;
}

export class InfluencerSurveyDesiredIncomeDto
  implements Partial<InfluencerSurveyAmount>
{
  @IsNumber()
  surveyType: number;
  @ApiProperty({ type: Number })
  @IsNumber()
  desiredAmount: Decimal;
}

export class InfluencerCampaignDesiredIncomeDto
  implements Partial<InfluencerCampaignAmount>
{
  @IsNumber()
  postType: number;
  @ApiProperty({ type: Number })
  @IsNumber()
  desiredAmount: Decimal;
}

export class UpdateInfluencerDto implements Partial<User>, Partial<Influencer> {
  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @MaxLength(30)
  @Matches(nameRegex)
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @MaxLength(30)
  @Matches(nameRegex)
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @Matches(passwordRegex)
  @IsOptional()
  password?: string;

  @IsNumber()
  @IsOptional()
  locationId?: number;

  // role: number;
  // ? status: number;
  // ? is deleted: boolean;
  @IsNumber()
  @IsOptional()
  status?: number;

  @IsNumber()
  @IsOptional()
  currency?: number;
  // createdAt: Date;
  // updatedAt: Date;

  // userId: number;
  // invitendByUserId: number;
  // TODO remove stakeholderId (influencer has multiple of it)

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @IsDate()
  @IsOptional()
  verifiedSince?: Date;

  @IsNumber()
  @IsOptional()
  ethnicityId?: number;

  // This represents experience
  @IsEnum(InfluencerType)
  @IsOptional()
  type?: InfluencerType;

  @IsArray()
  // @Type(() => Number)
  @IsOptional()
  diseaseAreas?: number[];

  // @IsArray()
  // @Type(() => InfluencerSocialPlatformDto)
  // @ValidateNested({ each: true })
  // @IsOptional()
  // socialPlatforms?: InfluencerSocialPlatformDto[];

  @IsArray()
  @Type(() => InfluencerCampaignDesiredIncomeDto)
  @ValidateNested({ each: true })
  @IsOptional()
  campaignDesiredIncome?: InfluencerCampaignDesiredIncomeDto[];

  @IsArray()
  @Type(() => InfluencerSurveyDesiredIncomeDto)
  @ValidateNested({ each: true })
  @IsOptional()
  surveyDesiredIncome?: InfluencerSurveyDesiredIncomeDto[];

  @IsString()
  @IsOptional()
  instagramUsername?: string;

  // @ApiPropertyOptional({ type: InfluencerCampaignDesiredIncomeDto, isArray: true })
  // @IsArray({ each: true })
  // @ValidateNested({ each: true })
  // @Type(() => InfluencerSurveyDesiredIncomeDto)
  // surveyDesiredIncome: InfluencerSurveyDesiredIncomeDto[];
  /* surveyDesiredIncome: (
    | CreateInfluencerSurveyAmountDto
    | UpdateInfluencerSurveyAmountDto
  )[]; */
  // @ValidateNested({ each: true })
  // @Type(() => InfluencerCampaignDesiredIncomeDto)
  // campaignDesiredIncome: InfluencerCampaignDesiredIncomeDto[];
  /* @Type(
    () => CreateInfluencerCampaignAmountDto | UpdateInfluencerCampaignAmountDto,
  ) */
  /* @Type(() => {
    const types = [
      CreateInfluencerCampaignAmountDto,
      UpdateInfluencerCampaignAmountDto,
    ];
    return Array.from(types, (cls) => ({ type: cls }));
  }) */
  /* @Type(() => [
    CreateInfluencerCampaignAmountDto,
    UpdateInfluencerCampaignAmountDto,
  ]) */
  /* @Type(() => {
    const types = [
      CreateInfluencerCampaignAmountDto,
      UpdateInfluencerCampaignAmountDto,
    ];
    return types[Math.floor(Math.random() * types.length)]; // choose a random type
  })
  @ApiProperty({
    type: () => [
      CreateInfluencerCampaignAmountDto,
      UpdateInfluencerCampaignAmountDto,
    ],
  }) */
  /* @ApiProperty({
    type: [
      CreateInfluencerCampaignAmountDto,
      UpdateInfluencerCampaignAmountDto,
    ],
    isArray: true,
  }) */

  /* @Type((type) => {
    return (
      UpdateInfluencerCampaignAmountDto || CreateInfluencerCampaignAmountDto
    );
  }) */
  /* @Type(() => InfluencerCampaignAmountDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(CreateInfluencerCampaignAmountDto) },
        { $ref: getSchemaPath(UpdateInfluencerCampaignAmountDto) },
      ],
    },
  }) */
  /* @Type((type) => {
    return (
      UpdateInfluencerCampaignAmountDto || CreateInfluencerCampaignAmountDto
    );
  })
  @ApiProperty({
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(CreateInfluencerCampaignAmountDto) },
      { $ref: getSchemaPath(UpdateInfluencerCampaignAmountDto) },
    ],
  }) */
  // campaignDesiredIncome: InfluencerCampaignAmountDto[];
}
