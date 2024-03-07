import { HttpException, HttpStatus } from '@nestjs/common';

export class MailServerException extends HttpException {
  constructor(recipient: string, exception: Error) {
    super(
      `Mail server failed to send an email to ${recipient}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        cause: exception,
      },
    );
  }
}
