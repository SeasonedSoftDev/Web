import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { NotificationsService } from './notifications.service';
import {
  Logger,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  CustomWsExceptionFilter,
  PrismaClientErrorFilter,
} from 'src/integrations/socket.io/exceptions';
import { EventNameInterceptor } from 'src/interceptors/websocket';
import { SocketWithAuth } from 'src/integrations/socket.io/types';

@WebSocketGateway({
  namespace: 'notifications',
  transports: ['websocket'],
  pingTimeout: 60000,
  perMessageDeflate: false,
})
@UseFilters(PrismaClientErrorFilter, CustomWsExceptionFilter)
@UseInterceptors(EventNameInterceptor)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);
  constructor(private readonly notificationsService: NotificationsService) {}

  @WebSocketServer()
  ioNamespace: Namespace;

  afterInit(namespace: Namespace) {
    this.notificationsService.socket = namespace;
    this.logger.log(`Gateway on namespace ${namespace.name} initialized!`);
  }

  handleConnection(client: SocketWithAuth) {
    const sockets = this.ioNamespace.sockets;
    if (client.authPayload.id) {
      client.join(`${client.authPayload.id}`);
    }

    client.setMaxListeners(0);
    this.logger.log(`Client with user id: ${client.authPayload.id} connected!`);
    this.logger.debug(
      `Number of connected notification clients: ${sockets.size}`,
    );
  }

  handleDisconnect(client: SocketWithAuth) {
    // client.leave(`${client.authPayload.id}`);
    client.disconnect();
    this.logger.log(
      `Client with user id: ${client.authPayload.id} disconnected!`,
    );
  }

  @SubscribeMessage('getUsersNotifications')
  async getUsersNotifications(
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<WsResponse<any[]>> {
    const notifications = await this.notificationsService.getUsersNotifications(
      client.authPayload,
    );
    this.logger.log(`Notifications: ${notifications.length}`);
    return { event: 'getUsersNotifications', data: notifications };
  }

  @SubscribeMessage('markNotificationsAsSeen')
  handleMarkMessagesRead(
    @MessageBody('notificationIds') notificationIds: number[],
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    this.notificationsService.markNotificationsAsSeenByUser(
      notificationIds,
      client.authPayload,
    );
  }
}
