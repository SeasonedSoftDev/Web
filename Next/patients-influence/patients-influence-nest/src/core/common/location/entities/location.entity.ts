import { Location } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';

export class LocationEntity implements Location {
  id: number;
  name: string;
  isCommon: boolean;
  countryId: number;
  createdAt: Date;
  updatedAt: Date;

  /* @Transform((obj) =>
    obj.value !== null ? new LocationEntity(obj.value) : obj.value,
  ) */
  country?: LocationEntity;

  constructor({ country, ...data }: Partial<LocationEntity>) {
    Object.assign(this, data);

    if (country) this.country = new LocationEntity(country);
  }
}

export class CountryEntity extends LocationEntity {}
