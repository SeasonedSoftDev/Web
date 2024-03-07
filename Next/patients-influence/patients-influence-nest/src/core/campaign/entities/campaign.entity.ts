import { Campaign, CampaignStakeholderType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { CompanyProductEntity } from 'src/core/common/company/entities/company-product.entity';
import { PlatformProductOrderEntity } from 'src/core/platform-product/entities';
import { ExampleImageEntity } from './example-image.entity';
import { Gender } from 'src/core/users/enums/gender';
import { PostType } from 'src/core/influencer/subroutes/desired-income/campaign/enums/post-type.enum';
import { Language } from 'src/core/platform-product/enums/language.enum';
import { StakeholderType } from 'src/utils/enums/stakeholder-type.enum';
import { ReportType } from '../enums';

export class EnumEntity {
  constructor(partial: Partial<EnumEntity>) {
    Object.assign(this, partial);
  }
  name: string;
  value: number;
}
export class PostTypeEntity extends EnumEntity {
  constructor(partial: Partial<PostTypeEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class LanguageEntity extends EnumEntity {
  constructor(partial: Partial<LanguageEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class ReportEntity extends EnumEntity {
  constructor(partial: Partial<ReportEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class StakeholderTypeEntity extends EnumEntity {
  constructor(partial: Partial<StakeholderTypeEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class CampaignEntity implements Campaign {
  id: number;
  name: string;
  platformProductOrderId: number;
  dateStart: Date;
  dateEnd: Date;
  description: string;
  influencersCount: number;
  influencersSizeId: number;
  ageMin: number;
  ageMax: number;
  @Transform(({ value }) =>
    ![undefined, null].includes(value)
      ? new LanguageEntity({ name: Language[value], value })
      : value,
  )
  language: number;
  targetAudienceDescription: string;
  socialPlatformId: number;
  @Transform(({ value }) =>
    ![undefined, null].includes(value)
      ? new PostTypeEntity({ name: PostType[value], value })
      : value,
  )
  postType: number;
  clientCompanyWebsite: string;
  instructions: string;
  contract: string;
  isContractApproved: boolean;
  @Transform(({ value }) =>
    ![undefined, null].includes(value)
      ? new ReportEntity({ name: ReportType[value], value })
      : value,
  )
  report: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;

  @Type(() => CompanyProductEntity)
  productOption?: CompanyProductEntity;
  // campaignReport: CampaignReportEntity;
  // campaignInfluencerSizes: CampaignInfluencersSizeEntity[];
  // campaignInfluencerPerformances: CampaignInfluencerPerformanceEntity[];
  @Transform(({ value }) => value.map((item) => new ExampleImageEntity(item)))
  exampleImages?: ExampleImageEntity[];
  // @Type(() => PlatformProductOrderEntity)
  platformProductOrder?: PlatformProductOrderEntity;

  @Transform(({ value }) => {
    return value.map((element: CampaignStakeholderType) =>
      ![undefined, null].includes(element)
        ? new StakeholderTypeEntity({
            name: StakeholderType[element.stakeholderType],
            value: element.stakeholderType,
          })
        : element,
    );
  })
  stakeholderTypes?: CampaignStakeholderType[];

  constructor({
    productOption,
    exampleImages,
    platformProductOrder,
    ...data
  }: Partial<CampaignEntity>) {
    Object.assign(this, data);

    if (productOption) this.productOption = productOption;
    if (exampleImages) this.exampleImages = exampleImages;
    if (platformProductOrder)
      this.platformProductOrder = new PlatformProductOrderEntity(
        platformProductOrder,
      );
  }
}
