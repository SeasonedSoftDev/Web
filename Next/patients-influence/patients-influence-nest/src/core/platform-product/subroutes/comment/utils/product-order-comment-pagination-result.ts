import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { ApiProperty } from '@nestjs/swagger';
import { ProductOrderCommentEntity } from '../entities/product-order-comment.entity';

export class ProductOrderCommentPaginationResult extends PaginationResult<ProductOrderCommentEntity> {
  @ApiProperty({ type: [ProductOrderCommentEntity] })
  result: ProductOrderCommentEntity[];
}
