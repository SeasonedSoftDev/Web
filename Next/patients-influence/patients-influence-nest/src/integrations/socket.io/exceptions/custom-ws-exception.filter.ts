import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';
import { Socket } from 'socket.io';

@Catch() //catch all exceptions
export class CustomWsExceptionFilter implements WsExceptionFilter {
  catch(error: any, host: ArgumentsHost): void {
    const ctx = host.switchToWs();
    const client: Socket = ctx.getClient();

    client.emit(error.eventName, {
      event: error.eventName,
      error: error.name,
      message: error.message,
    });
  }
}
