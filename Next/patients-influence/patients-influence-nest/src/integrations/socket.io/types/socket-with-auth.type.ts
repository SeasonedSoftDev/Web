import { Socket } from 'socket.io';
import { AuthPayload } from './auth-payload.type';

export type SocketWithAuth = Socket & AuthPayload;
