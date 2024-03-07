export type TAddBenefit = {
  benefitPartnershipId: number | null;
  benefitCompanyLink: string;
  description: string;
  benefitCategoryId: number | null;
  benefitLocations: Array<number> | null;
};

export type TSingleBenefit = {
  id: number;
};

export type TAddSuggestion = {
  partnershipName: string;
  partnershipLink: string;
  argumentDescription: string;
  outcomeDescription: string;
};
