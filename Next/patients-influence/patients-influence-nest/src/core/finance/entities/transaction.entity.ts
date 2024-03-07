import { InfluencerAmbassadorWithdraw, Transaction } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Transform } from 'class-transformer';

export class TransactionEntity implements Transaction {
  id: number;

  transactionFlowId: number;

  status: number;

  @Transform((obj) => obj.value.toNumber(), { toPlainOnly: true })
  availableAmounts: Decimal;

  @Transform((obj) => obj.value.toNumber(), { toPlainOnly: true })
  unavailableAmounts: Decimal;

  createdAt: Date;

  updatedAt: Date;

  influencerAmbassadorWithdraws: InfluencerAmbassadorWithdraw[];

  constructor(data: Partial<Transaction>) {
    Object.assign(this, data);
  }
}
