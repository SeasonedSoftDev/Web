import { IsOptional, IsString } from 'class-validator';

export class FilterSearchInfluencersDto {
  @IsOptional()
  @IsString()
  filterCase?: string;
}
