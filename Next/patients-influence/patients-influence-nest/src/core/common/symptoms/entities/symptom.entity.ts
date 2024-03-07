import { Symptom } from '@prisma/client';

export class SymptomEntity implements Symptom {
  id: number;
  name: string;
  identifier: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<SymptomEntity>) {
    Object.assign(this, partial);
  }
}
