import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { Status } from 'src/core/campaign/enums';
// import { Status } from 'src/core/campaign/enums/status.enum';
import { ProductOrderInfluencerStatus } from 'src/core/platform-product/enums/product-order-influencer-status.enum';

export class InfluencerCampaignFilterParamsDto {
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
