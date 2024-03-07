import { PlatformProductOrderChatMessage } from '@prisma/client';

export class MessageEntity implements PlatformProductOrderChatMessage {
  constructor(partial: Partial<MessageEntity>) {
    Object.assign(this, partial);
  }
  id: number;
  chatRoomId: number;
  authorId: number;
  message: string;
  isDeleted: boolean;
  deleteForAll: boolean;
  createdAt: Date;
  updatedAt: Date;
}
