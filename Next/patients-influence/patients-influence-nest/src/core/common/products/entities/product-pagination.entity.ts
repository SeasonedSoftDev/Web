import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { ProductEntity } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ProductPaginationEntity extends PaginationResult<ProductEntity> {
  @ApiProperty({ type: [ProductEntity] })
  result: ProductEntity[];
}
