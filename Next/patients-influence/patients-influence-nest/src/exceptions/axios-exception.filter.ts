import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';
import { formatAxiosErrorMessage } from 'src/utils/formatters/errors/axios-error-message.formatter';

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('AxiosExceptionsHandler');

  catch(exception: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.response?.status
      ? exception.response.status
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.response?.statusText
      ? exception.response.statusText
      : 'Internal server error';

    const { message: internalMessage, stack } =
      formatAxiosErrorMessage(exception);
    // * log only if there is a stack, as it indicates an unknown problem
    if (stack) this.logger.error(internalMessage, stack);

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
