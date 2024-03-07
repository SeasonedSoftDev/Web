import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { decorate } from 'ts-mixer';

export class SearchParamDto {
  @decorate(IsOptional())
  @decorate(IsString())
  @decorate(
    ApiPropertyOptional({
      description: 'Search phrase (see more at endpoint description if any).',
    }),
  )
  search?: string;
}
