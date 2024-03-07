import { ApiProperty } from '@nestjs/swagger';

interface IPaginationMeta {
  skip: number;
  limit: number;
  countTotal: number;
  countFiltered: number;
  [other: string]: any;
}

class PaginationtMeta implements IPaginationMeta {
  @ApiProperty()
  skip: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  countTotal: number;

  @ApiProperty()
  countFiltered: number;

  [other: string]: any;
}

export class PaginationResult<T> {
  @ApiProperty({
    description: 'Pagination metadata (supports custom properties)',
    example: {
      skip: 0,
      limit: 10,
      countTotal: 200,
      countFiltered: 100,
      customProperty: 'value',
    },
  })
  meta: PaginationtMeta;
  result: Array<T>;
}
