import { Client, CompanyTitle } from '@prisma/client';
import { AmbassadorEntity } from 'src/core/ambassador/entities';
import { UserEntity } from 'src/core/users/entities/user.entity';
import { DiscoverClientEntity } from './discover-client.entity';
import { CompanyEntity } from 'src/core/common/company/entities/company.entity';
import { IndustryEntity } from 'src/core/common/industry/entities/industry.entity';
import { CompanyTitleEntity } from 'src/core/common/company/entities/company-title.entity';

export class ClientEntity implements Client {
  id: number;
  userId: number;
  companyId: number;
  companyTitleId: number;
  industryId: number;
  ambassadorId: number;
  createdAt: Date;
  updatedAt: Date;

  user?: UserEntity;
  ambassador?: AmbassadorEntity;
  company?: CompanyEntity;
  companyTitle?: CompanyTitle;
  industry?: IndustryEntity;

  constructor({
    user,
    ambassador,
    company,
    companyTitle,
    industry,
    ...data
  }: Partial<ClientEntity>) {
    Object.assign(this, data);

    if (user) this.user = new UserEntity(user);
    if (ambassador) this.ambassador = new AmbassadorEntity(ambassador);
    if (company) this.company = new CompanyEntity(company);
    if (companyTitle) this.companyTitle = new CompanyTitleEntity(companyTitle);
    if (industry) this.industry = new IndustryEntity(industry);
  }

  asDiscoverClient?() {
    return new DiscoverClientEntity({
      id: this.user.id,
      firstName: this.user?.firstName,
      lastName: this.user?.lastName,
      companyId: this.companyId,
      companyTitleId: this.companyTitleId,
      industryId: this.industryId,
      email: this.user?.email,
      locationId: this.user?.locationId,
      status: this.user?.status,
      invitationToken: null,
      contactedAt: null,
      isDeleted: this.user?.isDeleted,
      createdAt: this.user?.createdAt,
      updatedAt: this.user?.updatedAt,
      company: this.company,
      companyTitle: this.companyTitle,
      industry: this.industry,
      location: this.user?.location,

      clientId: this.id,
      _client: this,
      isClient: true,
    });
  }
}
