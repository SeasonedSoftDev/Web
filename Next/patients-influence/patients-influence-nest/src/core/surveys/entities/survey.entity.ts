import {
  ClientSurveyTokenBalance,
  Survey,
  SurveyStakeholderType,
} from '@prisma/client';
import { Transform } from 'class-transformer';
import { ExampleImageEntity } from 'src/core/campaign/entities/example-image.entity';
import { PlatformProductOrderEntity } from 'src/core/platform-product/entities';
import { Gender } from 'src/core/users/enums/gender';
import { ClientSurveyTokenBalanceEntity } from './client-survey-token-balance.entity';
import { StakeholderType } from 'src/utils';

export class EnumEntity {
  constructor(partial: Partial<EnumEntity>) {
    Object.assign(this, partial);
  }
  name: string;
  value: number;
}

export class StakeholderTypeEntity extends EnumEntity {
  constructor(partial: Partial<StakeholderTypeEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class SurveyEntity implements Survey {
  id: number;
  name: string;
  platformProductOrderId: number;
  dateStart: Date;
  dateEnd: Date;
  language: number;
  surveyDescription: string;
  participantCount: number;
  questionCount: number;
  ageMin: number;
  ageMax: number;
  gender: Gender;
  participantsDescription: string;
  surveyType: number;
  fileUploadUrl: string;
  instructionsDescription: string;
  questionCredits: number;
  link: string;
  contract: string;
  isContractApproved: boolean;
  status: number;
  createdAt: Date;
  updatedAt: Date;

  @Transform(({ value }) => {
    return value.map((element: SurveyStakeholderType) =>
      ![undefined, null].includes(element)
        ? new StakeholderTypeEntity({
            name: StakeholderType[element.stakeholderType],
            value: element.stakeholderType,
          })
        : element,
    );
  })
  stakeholderTypes?: SurveyStakeholderType[];

  @Transform(({ value }) =>
    value.map((item) => new ClientSurveyTokenBalanceEntity(item)),
  )
  clientSurveyTokenBalances?: ClientSurveyTokenBalance[];
  @Transform(({ value }) => value.map((item) => new ExampleImageEntity(item)))
  exampleImages?: ExampleImageEntity[];
  // @Type(() => PlatformProductOrderEntity)
  platformProductOrder?: PlatformProductOrderEntity;

  constructor({
    exampleImages,
    platformProductOrder,
    ...data
  }: Partial<SurveyEntity>) {
    Object.assign(this, data);

    if (exampleImages) this.exampleImages = exampleImages;
    if (platformProductOrder)
      this.platformProductOrder = new PlatformProductOrderEntity(
        platformProductOrder,
      );
  }
}
