import {
  ClientSMLTokenBalance,
  PlatformProductOrder,
  PlatformProductOrderDiseaseArea,
  SMLPlatform,
  SocialMediaListening,
  User,
} from '@prisma/client';
import { PlatformProductOrderService } from 'src/core/platform-product/platform-product-order.service';

export type SmlWithType = SocialMediaListening & {
  platformProductOrder?: PlatformProductOrder & {
    user?: User;
    platformProductOrderLocations?: PlatformProductOrder[];
    platformProductOrderDiseaseAreas?: PlatformProductOrderDiseaseArea[];
    platformProductOrderInterests?: PlatformProductOrder[];
    platformProductOrderEthnicities?: PlatformProductOrderService[];
    platformProductOrderStruggles?: PlatformProductOrder[];
  };
  clientSMLTokenBalances?: ClientSMLTokenBalance[];
  SMLPlatforms?: SMLPlatform[];
};
