export type TAddInfluencer = {
  firstName: string;
  email: string;
  diseaseArea: string;
  location: string;
  socialMedia: string;
  username: string;
  followers: number;
};

export type TContactInfluencer = {
  subject: string;
  message: string;
  userId: string;
};

export type TUpdateInfluencer = {
  firstName: string;
  email: string;
  diseaseAreaId: string;
  subDiseaseAreaId: string;
  countryId: string;
  cityId: string;
  socialMedia: string;
  username: string;
  followers: number;
};
