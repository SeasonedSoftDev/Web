import { TransactionFlow } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Transform } from 'class-transformer';

export class TransactionFlowEntity implements TransactionFlow {
  id: number;

  userId: number;

  type: number;

  productOrderId: number;

  @Transform((obj) => obj.value.toNumber(), { toPlainOnly: true })
  amount: Decimal;

  createdAt: Date;

  updatedAt: Date;

  name: string;

  constructor(data: Partial<TransactionFlow>) {
    Object.assign(this, data);
  }
}
