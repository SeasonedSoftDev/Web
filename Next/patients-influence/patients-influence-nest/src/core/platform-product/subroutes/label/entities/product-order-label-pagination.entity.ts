import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { ApiProperty } from '@nestjs/swagger';
import { ProductOrderLabelEntity } from './product-order-label.entity';

export class ProductOrderLabelPaginationEntity extends PaginationResult<ProductOrderLabelEntity> {
  @ApiProperty({ type: [ProductOrderLabelEntity] })
  result: ProductOrderLabelEntity[];
}
