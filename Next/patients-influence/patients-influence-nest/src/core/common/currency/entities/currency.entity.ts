import { Currency } from '@prisma/client';
export class CurrencyEntity implements Currency {
  constructor(partial: Partial<CurrencyEntity>, conversionRate?: number) {
    Object.assign(this, partial);
    this.conversionRate = conversionRate;
  }
  id: number;
  code: string;
  createdAt: Date;
  updatedAt: Date;

  conversionRate?: number;
}
