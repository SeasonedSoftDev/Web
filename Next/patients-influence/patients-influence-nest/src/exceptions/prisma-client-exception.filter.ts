import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('PrismaClientExceptionsHandler');

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002':
        // * error code P2002 is very specific so it should probably be handled
        // * within each module, not on global scale as we don't know for what
        // * reason unique constraint failed.
        // TODO review if comment above is true or figure out how to implement it
        /* response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: exception.message,
        });
        if ((exception.meta?.target as unknown[])?.includes('email') && exception.message.includes('user')) {

        } */
        break;
      case 'P2003':
        response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Foreign key constraint failed',
        });
        break;
      case 'P2025':
        response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: exception.meta?.cause || exception.message,
        });
        break;
      default:
        this.logger.error(exception.message, exception.stack);

        response.status(500).json({
          statusCode: 500,
          message: "Couldn't process database request",
        });
        break;
    }
  }
}
