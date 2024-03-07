import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Cause } from '../types/cause.type';
import { MailServerException } from './mail-server.exception';

@Catch(MailServerException)
export class SendgridExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('SendgridExceptionsHandler');

  catch(exception: MailServerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 500;
    const realCause = (exception.cause as unknown as Cause).response.body.errors
      ?.map((error) => `\n- ${error.message}`)
      .join();
    const message = `${exception.message}${
      realCause !== undefined ? ': ' + realCause : ''
    }`;

    this.logger.error(message, undefined);

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
