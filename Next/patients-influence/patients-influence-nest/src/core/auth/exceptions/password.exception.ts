import { UnauthorizedException } from '@nestjs/common';

export class InvalidPasswordException extends UnauthorizedException {
  constructor({ id, email }: { id?: number; email?: string }) {
    let message = `Invalid password provided`;
    const userIdentity = id ? (email ? `${email} (${id})` : id) : email;

    if (userIdentity !== undefined) {
      message = `Invalid password provided by ${userIdentity}`;
    }

    super(message);
  }
}
