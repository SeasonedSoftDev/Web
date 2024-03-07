import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { LoginDto } from 'src/core/auth/dto/login.dto';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ThrottlerExceptionsHandler');

  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (response.req.url.includes('login')) {
      const ip = response.req.ips.length
        ? response.req.ips[0]
        : response.req.ip;
      const email = (response.req.body as LoginDto).email;

      this.logger.warn(`Login request throttled from ${ip}: ${email}`);
    }

    response.status(HttpStatus.TOO_MANY_REQUESTS).json({
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      message: 'Too many requests',
    });
  }
}
