import { BenefitSuggestion } from '@prisma/client';

export class BenefitSuggestionEntity implements BenefitSuggestion {
  id: number;
  authorId: number;
  partnershipName: string;
  partnershipLink: string;
  argumentDescription: string;
  outcomeDescription: string;
  statusDescription: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor({ ...data }: Partial<BenefitSuggestionEntity>) {
    Object.assign(this, data);
  }
}
