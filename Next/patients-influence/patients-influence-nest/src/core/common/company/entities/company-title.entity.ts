import { CompanyTitle } from '@prisma/client';

export class CompanyTitleEntity implements CompanyTitle {
  constructor(partial: Partial<CompanyTitleEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
