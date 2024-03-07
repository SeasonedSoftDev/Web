import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { decorate } from 'ts-mixer';

export class PaginationParamsDto {
  @decorate(IsOptional())
  @decorate(IsNumber())
  @decorate(Min(0))
  @decorate(
    ApiPropertyOptional({
      type: Number,
      minimum: 0,
      default: 0,
      description:
        'Number of skipped records after which a new records will be fetched.',
    }),
  )
  @decorate(Transform((obj) => parseInt(obj.value)))
  skip?: number = 0;

  @decorate(IsOptional())
  @decorate(IsNumber())
  @decorate(Min(1))
  @decorate(Max(500))
  @decorate(
    ApiPropertyOptional({
      type: Number,
      minimum: 1,
      maximum: 500,
      default: 10,
      description: 'Number of records to retrieve.',
    }),
  )
  @decorate(Transform((obj) => parseInt(obj.value)))
  limit?: number = 10;

  get take() {
    return this.limit;
  }
}
