import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class FindByUserDto {
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  userId: number;

  @IsOptional()
  @IsString()
  search?: string;
}
