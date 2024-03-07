import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApplicationException } from './application.exception';
import { Request, Response } from 'express';
import { SocialPlatformException } from 'src/core/influencer/exceptions/social-platform.exception';
import { JsonWebTokenError } from 'jsonwebtoken';

@Catch(ApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ApplicationExceptionsHandler');

  catch(
    exception: ApplicationException & { status?: number },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // * log only if it's not user's fault
    if (exception.status === undefined || exception.status >= 500) {
      this.logger.error(exception.message);
    }

    if (exception instanceof SocialPlatformException) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad request',
      });
    }

    if (exception instanceof JsonWebTokenError) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: exception.message,
      });
    }
    // TODO review if a generic response is more suitable
    /* response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    }); */
    response.status(exception.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: exception.status || HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || 'Internal server error',
    });
  }
}
