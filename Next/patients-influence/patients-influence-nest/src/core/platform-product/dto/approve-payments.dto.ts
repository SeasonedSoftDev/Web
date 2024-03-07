import { IsArray, IsEnum, IsInt } from 'class-validator';
import { ProductOrderInfluencerStatus } from '../enums/product-order-influencer-status.enum';

export class ApprovePaymentsDto {
  @IsArray()
  @IsInt({ each: true })
  paymentIds: number[];

  @IsEnum(ProductOrderInfluencerStatus)
  status: ProductOrderInfluencerStatus;
}
