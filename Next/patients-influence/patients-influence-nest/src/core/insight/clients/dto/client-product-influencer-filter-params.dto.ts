import { OmitType } from '@nestjs/swagger';
import { ClientProductFilterParamsDto } from './client-product-filter-params.dto';

export class ClientProductInfluencerFilterParamsDto extends OmitType(
  ClientProductFilterParamsDto,
  ['withNoReport'],
) {}

export class ClientCampaignInfluencerFilterParamsDto extends OmitType(
  ClientProductInfluencerFilterParamsDto,
  ['product'],
) {}

export class ClientSurveyInfluencerFilterParamsDto extends OmitType(
  ClientProductInfluencerFilterParamsDto,
  ['product'],
) {}
