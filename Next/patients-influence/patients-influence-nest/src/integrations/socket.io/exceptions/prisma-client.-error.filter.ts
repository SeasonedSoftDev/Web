import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Socket } from 'socket.io';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientErrorFilter implements ExceptionFilter {
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
