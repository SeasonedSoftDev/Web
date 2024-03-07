import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePlatformProductOrderDto } from './create-platform-product-order.dto';

export class UpdatePlatformProductOrderDto extends PartialType(
  OmitType(CreatePlatformProductOrderDto, [
    'clientId',
    'platformProduct',
  ] as const),
) {}
