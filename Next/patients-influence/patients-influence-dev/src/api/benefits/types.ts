export type TAddBenefit = {
  benefitPartnership: {
    name: string;
    id?: number;
  };
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

export interface IGetBenefitSuggestions {
  meta: IMeta;
  result: IBenefitSuggestion[];
}

export interface IMeta {
  skip: number;
  limit: number;
  countTotal: number;
  countFiltered: number;
}

export interface IBenefitSuggestion {
  id: number;
  authorId: number;
  partnershipName: string;
  partnershipLink: string;
  argumentDescription: string;
  outcomeDescription: string;
  statusDescription: any;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  benefitUpvoteCounts: IBenefitUpvoteCount[];
  author: IBenefitSuggestionAuthor;
}

export interface IBenefitUpvoteCount {
  id: number;
  benefitSuggestionId: number;
  userId: number;
  isUpvoted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBenefitSuggestionAuthor {
  id: number;
  firstName: string;
  lastName: string;
  influencer?: IBenefitSuggestionInfluencer;
}

export interface IBenefitSuggestionInfluencer {
  id: number;
  stakeholders?: IBenefitSuggestionStakeholder[];
}

export interface IBenefitSuggestionStakeholder {
  id: number;
  socialPlatformUsername: string;
}

// Get All Benefits

export interface IGetAllBenefits {
  meta: IBenefitMeta;
  result: IPaginatedBenefit[];
}

export interface IBenefitMeta {
  skip: number;
  limit: number;
  countTotal: number;
  countFiltered: number;
}

export interface IPaginatedBenefit {
  id: number;
  benefitPartnershipId: number;
  benefitCompanyLink: string;
  description: string;
  benefitCategoryId: number;
  createdAt: string;
  updatedAt: string;
  benefitPartnership: IBenefitPartnership;
  benefitCategory: IBenefitCategory;
  benefitLocations: IBenefitLocation[];
}

export interface IBenefitPartnership {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBenefitCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBenefitLocation {
  id: number;
  benefitId: number;
  locationId: number;
  createdAt: string;
  updatedAt: string;
  location: ILocation;
}

export interface ILocation {
  id: number;
  name: string;
  isCommon: boolean;
  countryId: number;
  createdAt: string;
  updatedAt: string;
  country: ICountry;
}

export interface ICountry {
  id: number;
  name: string;
  isCommon: boolean;
  countryId: any;
  createdAt: string;
  updatedAt: string;
}

export interface IEditBenefitSuggestion {
  argumentDescription: string;
  outcomeDescription: string;
  partnershipLink: string;
  partnershipName: string;
  statusDescription?: string;
  isApproved?: boolean;
}

export interface IBulkSuggestionBody {
  suggestionIds: number[];
}

export interface IBulkBenefitBody {
  benefitIds: number[];
}
