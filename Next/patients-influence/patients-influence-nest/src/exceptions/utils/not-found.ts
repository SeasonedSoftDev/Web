import { ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

/**
 * Checks if unique constraint failed on the email field.
 * Reference: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
 */
export function throwIfNotFound(err: Error, obj: any) {
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2002' &&
    (err.meta?.target as unknown[])?.includes('email')
  ) {
    throw new ForbiddenException('Email already in use');
  }
}
