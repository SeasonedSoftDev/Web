import { decorate, mix } from 'ts-mixer';

import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';

interface BenefitLocation {
  value: string;
  label: string;
}

interface BenefitCategory {
  value: string;
  label: string;
}

export class BenefitFilterDto extends FilterParamsDto {
  @decorate(IsOptional())
  @decorate(
    ApiPropertyOptional({
      description: 'Location.',
    }),
  )
  location?: BenefitLocation;

  @decorate(IsOptional())
  @decorate(
    ApiPropertyOptional({
      description: 'Category.',
    }),
  )
  category?: BenefitCategory;
}
