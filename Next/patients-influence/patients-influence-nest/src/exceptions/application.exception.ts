import { HttpStatus } from '@nestjs/common';
import './axios-client.filter'

export class ApplicationException extends Error {
  private readonly data: any;

  constructor(message: string, data?: any) {
    super(message);

    this.data = data;
  }
}

export class BadRequestApplicationException extends ApplicationException {
  readonly status: number;

  constructor(message: string, data?: any) {
    super(message, data);

    this.status = HttpStatus.BAD_REQUEST;
  }
}

export class ForbiddenApplicationException extends ApplicationException {
  readonly status: number;

  constructor(message: string, data?: any) {
    super(message, data);

    this.status = HttpStatus.FORBIDDEN;
  }
}

export class NotFoundApplicationException extends ApplicationException {
  readonly status: number;

  constructor(message: string, data?: any) {
    super(message, data);

    this.status = HttpStatus.NOT_FOUND;
  }
}

export class NotAcceptableApplicationException extends ApplicationException {
  readonly status: number;

  constructor(message: string, data?: any) {
    super(message, data);

    this.status = HttpStatus.NOT_ACCEPTABLE;
  }
}
