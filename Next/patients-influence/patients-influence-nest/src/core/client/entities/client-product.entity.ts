import { ClientProduct } from '@prisma/client';
import { ProductEntity } from 'src/core/common/products/entities/product.entity';

export class ClientProductEntity implements ClientProduct {
  constructor(partial: Partial<ClientProductEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  clientId: number;
  productId: number;
  createdAt: Date;
  product: ProductEntity;
}
