import { Industry } from '@prisma/client';

export class IndustryEntity implements Industry {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IndustryEntity>) {
    Object.assign(this, data);
  }
}
