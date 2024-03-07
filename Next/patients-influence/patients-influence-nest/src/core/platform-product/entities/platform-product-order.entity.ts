// ! OLD import { PlatformProduct, PlatformProductOrder } from '@prisma/client';
import {
  PlatformProductOrder,
  PlatformProductOrderGender,
  PlatformProductOrderLanguage,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform, Type } from 'class-transformer';
import { ClientEntity } from 'src/core/client/entities/client.entity';
import { DiseaseAreaEntity } from 'src/core/common/disease-area/entities/disease-area.entity';
import { LocationEntity } from 'src/core/common/location/entities/location.entity';
import { UserEntity } from 'src/core/users/entities/user.entity';
import { PlatformProductOrderInfluencerEntity } from './platform-product-order-influencer.entity';
import { Gender } from 'src/core/users/enums/gender';
import { Status } from 'src/core/campaign/enums';
import { Language } from '../enums/language.enum';
import { FinanceStatus } from 'src/core/campaign/enums/finance-status.enum';

export class GenderEntity {
  constructor(partial: Partial<GenderEntity>) {
    Object.assign(this, partial);
  }
  name: string;
  value: number;
}

export class LanguageEntity {
  constructor(partial: Partial<LanguageEntity>) {
    Object.assign(this, partial);
  }
  name: string;
  value: number;
}

export class PlatformProductOrderEntity implements PlatformProductOrder {
  id: number;
  clientId: number;
  platformProduct: number;
  @Transform(
    (obj) => {
      if (obj.value === null) return obj.value;

      return obj.value.toNumber();
    },
    { toPlainOnly: true },
  )
  ambassadorCommission: Decimal | null;

  @Transform(
    (obj) => {
      if (obj.value === null) return obj.value;

      return obj.value.toNumber();
    },
    { toPlainOnly: true },
  )
  budget: Decimal | null;
  currencyId: number | null;
  status: Status;
  financeStatus: FinanceStatus | null;

  // currency: number | null;
  createdAt: Date;
  updatedAt: Date;

  @Type(() => ClientEntity)
  client?: ClientEntity;

  @Transform(({ value }) => {
    return value.map((element: PlatformProductOrderGender) =>
      ![undefined, null].includes(element)
        ? new GenderEntity({
            name: Gender[element.gender],
            value: element.gender,
          })
        : element,
    );
  })
  platformProductOrderGenders?: PlatformProductOrderGender[];

  @Transform(({ value }) => {
    return value.map((element: PlatformProductOrderLanguage) =>
      ![undefined, null].includes(element)
        ? new LanguageEntity({
            name: Language[element.language],
            value: element.language,
          })
        : element,
    );
  })
  platformProductOrderLanguages?: PlatformProductOrderLanguage[];

  // platformProduct?: PlatformProduct,    //! make entity
  // platformProductOrderLocations: true,
  // platformProductOrderDiseaseAreas: true,
  // platformProductOrderInterests: true,
  // platformProductOrderEthnicities: true,
  // platformProductOrderStruggles: true,

  // @Transform(({ value }) => value.map((item) => new LocationEntity(item)))
  // platformProductOrderLocations?: LocationEntity[];
  // @Transform(({ value }) => value.map((item) => new DiseaseAreaEntity(item)))
  // platformProductOrderDiseaseAreas?: DiseaseAreaEntity[];

  // TODO platformProductOrderDiseaseAreas?: InterestEntity[];
  // TODO platformProductOrderEthnicities: EthnicityEntity[];
  // TODO platformProductOrderEthnicities: StruggleEntity[];
  @Transform(({ value }) =>
    value.map((item) => new PlatformProductOrderInfluencerEntity(item)),
  )
  platformProductOrderInfluencers?: PlatformProductOrderInfluencerEntity[];

  constructor({
    // platformProductOrderLocations,
    // platformProductOrderDiseaseAreas,
    platformProductOrderInfluencers,
    ...data
  }: Partial<PlatformProductOrderEntity>) {
    Object.assign(this, data);

    // TODO fix and uncomment
    /* if (platformProductOrderLocations)
      this.platformProductOrderLocations = platformProductOrderLocations;
    if (platformProductOrderDiseaseAreas)
      this.platformProductOrderDiseaseAreas = platformProductOrderDiseaseAreas; */
    if (platformProductOrderInfluencers)
      this.platformProductOrderInfluencers = platformProductOrderInfluencers;
  }
}
