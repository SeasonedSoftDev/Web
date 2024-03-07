import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import Project from 'constants/project';
import {
  CreateRoomDto,
  FindChatRoomMessagesDto,
  SendMessageDto,
} from './types';

const ChatIO = {
  socket: {} as Socket,

  connect() {
    if (this.socket.connected) {
      return;
    }

    const token = Cookies.get('auth');

    const socketUrl = (() => {
      switch (Project.app.environment) {
        case 'production':
          return Project.socket.productionSocket;
        case 'staging':
          return Project.socket.stagingSocket;
        default:
          return Project.socket.developmentSocket;
      }
    })();

    this.socket = io(`${socketUrl}/chat`, {
      extraHeaders: {
        'x-jwt-cookie': `auth=${token}`,
      },
    });
  },

  createChatRoom(
    createRoomDto: CreateRoomDto,
    callback: (response: any) => void
  ) {
    this.socket.emit('createChatRoom', createRoomDto, callback);
  },

  disconnect() {
    this.socket.disconnect();
  },

  findChatMessagesByChatRoomId(
    findChatRoomMessagesDto: FindChatRoomMessagesDto,
    callback: (response: any) => void
  ) {
    this.socket.emit(
      'findChatMessagesByChatRoomId',
      findChatRoomMessagesDto,
      callback
    );
  },

  findChatRoomsByUserId(id: number, callback: (response: any) => void) {
    this.socket.emit('findChatRoomsByUserId', id, callback);
  },
  markMessagesAsRead(messageIds: number[]) {
    this.socket.emit('markMessagesAsRead', { messageIds });
  },

  joinRoom(chatRoomId: number) {
    this.socket.emit('joinRoom', { chatRoomId });
  },

  pingAdmin(chatRoomId: number, callback: (response: any) => void) {
    this.socket.emit('pingAdmin', { chatRoomId }, callback);
  },
  sendMessage(
    sendMessageDto: SendMessageDto,
    callback: (response: any) => void
  ) {
    this.socket.emit('sendMessage', sendMessageDto, callback);
  },

  subscribeToNewMessage(callback: (response: any) => void) {
    this.socket.on('newMessage', callback);
  },

  subscribeToNewMessages(callback: (response: any) => void) {
    this.socket.on('newMessages', callback);
  },

  subsribeToSendMessage(callback: (response: any) => void) {
    this.socket.on('sendMessage', callback);
  },

  subscribeToTyping(callback: (response: any) => void) {
    this.socket.on('typing', callback);
  },

  subscribeToFindChatRoom(callback: (response: any) => void) {
    this.socket.on('findChatRoomsByUserId', callback);
  },

  // subscribeToExistingMessages(callback)
};

export default ChatIO;
