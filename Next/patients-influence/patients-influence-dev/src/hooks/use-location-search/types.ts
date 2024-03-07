export type TLocation = {
  value: number;
  label: string;
};

export type TLocationsResults = {
  id: number;
  name: string;
  isCommon: boolean;
  countryId: number;
  createdAt: string;
  updatedAt: string;
  country?: {
    id: number;
    countryId: number | null;
    updatedAt: string;
    createdAt: string;
    name: string;
    isCommon: boolean;
  };
};
