import { ApiHideProperty } from '@nestjs/swagger';
import {
  Benefit,
  BenefitCategory,
  BenefitLocation,
  BenefitPartnership,
} from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';

export class BenefitPartnershipEntity implements BenefitPartnership {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor({ ...data }: Partial<BenefitPartnershipEntity>) {
    Object.assign(this, data);
  }
}

export class BenefitCategoryEntity implements BenefitCategory {
  id: number;
  name: string;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;

  constructor({ ...data }: Partial<BenefitCategoryEntity>) {
    Object.assign(this, data);
  }
}

export class BenefitLocationEntity implements BenefitLocation {
  id: number;
  benefitId: number;
  locationId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor({ ...data }: Partial<BenefitLocationEntity>) {
    Object.assign(this, data);
  }
}

export class BenefitEntity implements Benefit {
  id: number;
  benefitPartnershipId: number;
  benefitCompanyLink: string;
  benefitCategoryId: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;

  benefitPartnership?: BenefitPartnershipEntity;
  benefitCategory?: BenefitCategoryEntity;
  @Transform(({ value }) =>
    value.map((item) => new BenefitLocationEntity(item)),
  )
  benefitLocations?: BenefitLocationEntity[];

  constructor({
    benefitPartnership,
    benefitCategory,
    benefitLocations,
    ...data
  }: Partial<BenefitEntity>) {
    Object.assign(this, data);

    if (benefitPartnership) this.benefitPartnership = benefitPartnership;
    if (benefitCategory) this.benefitCategory = benefitCategory;
    if (benefitLocations) this.benefitLocations = benefitLocations;
  }
}
