import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateSMLDto {
  @ApiProperty({
    description: 'ClientId is specified only if an Admin is creating the SML',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  clientId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  productId?: number;

  @ApiProperty({
    description: 'SocialPlatform IDs that SML should include',
    type: [Number],
  })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { each: true },
  )
  @IsPositive({ each: true })
  platforms: number[];

  @ApiProperty({
    description: 'Subscription length in months. Must be 1 or greater',
  })
  @IsInt()
  @Min(0)
  subscriptionLength?: number;

  @ApiProperty({
    description:
      'Monthly token that selected package provides. Eg.:100, 200...',
  })
  @IsInt()
  @Min(0)
  monthlyTokens: number;

  @ApiProperty({
    description: 'Disease Area IDs that SML should include',
    type: [Number],
  })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { each: true },
  )
  @IsPositive({ each: true })
  diseaseAreas: number[];

  @IsOptional()
  @IsNumber({ allowInfinity: false, maxDecimalPlaces: 2, allowNaN: false })
  @IsPositive()
  budget?: number;

  @IsOptional()
  @IsString()
  smlDescription?: string;
}
