export interface CreateRoomDto {
  productOrderId: number;
  isGroupRoom: boolean;
  productOrderChatRoomMember?: number;
}

export interface SendMessageDto {
  chatRoomId: number;
  authorId: number;
  message: string;
}

export interface FindChatRoomMessagesDto {
  chatRoomId: number;
  page: number;
}
