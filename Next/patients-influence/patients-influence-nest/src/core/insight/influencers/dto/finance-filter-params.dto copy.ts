import { IsEnum, IsOptional } from 'class-validator';
import { PlatformProduct } from 'src/core/platform-product/enums/platform-product.enum';

export class InfluencerFinanceFilterParamsDto {
  @IsEnum(PlatformProduct)
  @IsOptional()
  platformProduct?: PlatformProduct;
}
