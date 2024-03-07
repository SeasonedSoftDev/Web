export class LabelTableResponseEntity {
  id: number;
  name: string;

  constructor(data: Partial<LabelTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class AmbassadorTableResponseEntity {
  id: number;
  firstName: string;
  lastName: string;
  email: string;

  constructor(data: Partial<AmbassadorTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class CompanyTableResponseEntity {
  id: number;
  name: string;

  constructor(data: Partial<CompanyTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class IndustryTableResponseEntity {
  id: number;
  name: string;

  constructor(data: Partial<IndustryTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class ProductTableResponseEntity {
  id: number;
  name: string;

  constructor(data: Partial<ProductTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class LocationTableResponseEntity {
  id: number;
  name: string;
  country: LocationTableResponseEntity;

  constructor(data: Partial<LocationTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class MarketTableResponseEntity {
  id: number;
  name: string;

  constructor(data: Partial<MarketTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class DiseaseAreaTableResponseEntity {
  id: number;
  name: string;
  parentDiseaseArea: DiseaseAreaTableResponseEntity;

  constructor(data: Partial<DiseaseAreaTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class RoleTableResponseEntity {
  id: number;
  name: string;

  constructor(data: Partial<RoleTableResponseEntity>) {
    Object.assign(this, data);
  }
}

export class ClientTableResponseEntity {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  registeredAt: Date;
  updatedAt: Date;
  labels: LabelTableResponseEntity[];
  clientId: number;
  ambassador: AmbassadorTableResponseEntity;
  company: CompanyTableResponseEntity;
  industry: IndustryTableResponseEntity;
  products: ProductTableResponseEntity[];
  location: LocationTableResponseEntity;
  markets: MarketTableResponseEntity[];
  diseaseAreas: DiseaseAreaTableResponseEntity[];
  role: RoleTableResponseEntity;
  // contactedAt: Date;

  totalBudget: number;
  totalBudgetLast30Days: number;
  totalProjects: number;
  totalOngoingProjects: number;
  totalProjectsLast30Days: number;

  averageCampaignBudget: number;
  totalCampaignBudget: number;
  totalCampaignBudgetLast30Days: number;
  totalCampaigns: number;
  totalCampaignsLast30Days: number;

  averageSurveyBudget: number;
  totalSurveyBudget: number;
  totalSurveyBudgetLast30Days: number;
  totalSurveys: number;
  totalSurveysLast30Days: number;

  averageSMLBudget: number;
  totalSMLBudget: number;
  totalSMLBudgetLast30Days: number;
  totalSMLs: number;
  totalSMLsLast30Days: number;

  constructor(data: Partial<ClientTableResponseEntity>) {
    Object.assign(this, data);
  }
}
