import { PlatformProductOrderChatRoom } from '@prisma/client';

export class PlatformProductOrderChatRoomEntity
  implements PlatformProductOrderChatRoom
{
  constructor(partial: Partial<PlatformProductOrderChatRoomEntity>) {
    Object.assign(this, partial);
  }
  isGroupRoom: boolean;
  id: number;
  productOrderId: number;
  createdAt: Date;
  updatedAt: Date;
}
