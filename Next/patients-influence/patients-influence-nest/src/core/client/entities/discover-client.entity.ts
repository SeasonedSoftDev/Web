import { DiscoverClient } from '@prisma/client';
import { CompanyTitleEntity } from 'src/core/common/company/entities/company-title.entity';
import { CompanyEntity } from 'src/core/common/company/entities/company.entity';
import { IndustryEntity } from 'src/core/common/industry/entities/industry.entity';
import { LocationEntity } from 'src/core/common/location/entities/location.entity';
import { ClientEntity } from './client.entity';

export class DiscoverClientEntity implements DiscoverClient {
  id: number;
  firstName: string;
  lastName: string;
  companyId: number;
  companyTitleId: number;
  industryId: number;
  email: string;
  locationId: number;
  status: number;
  invitationToken: string;
  contactedAt: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  company?: CompanyEntity;
  companyTitle?: CompanyTitleEntity;
  industry?: IndustryEntity;
  location?: LocationEntity;

  // * to store influencer that still does not have any product ordered
  clientId?: number;
  _client?: ClientEntity;
  isClient?: boolean = false;

  constructor({
    company,
    companyTitle,
    industry,
    location,
    ...data
  }: Partial<DiscoverClientEntity>) {
    Object.assign(this, data);

    if (company) this.company = new CompanyEntity(company);
    if (companyTitle) this.companyTitle = new CompanyTitleEntity(companyTitle);
    if (industry) this.industry = new IndustryEntity(industry);
    if (location) this.location = new LocationEntity(location);
  }
}
