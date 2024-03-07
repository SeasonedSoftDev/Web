import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ClientProductDto {
  @ApiProperty({
    description: 'For connecting existing products specify the productId',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  productId?: number;

  @ApiProperty({
    description:
      'For unexisting products specify the name without productId and new Product and ClientProduct relation will be created',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}

export class ClientProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientProductDto)
  clientProducts: ClientProductDto[];
}
