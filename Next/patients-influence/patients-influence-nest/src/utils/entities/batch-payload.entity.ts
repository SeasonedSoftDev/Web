import { Prisma } from '@prisma/client';

export class BatchPayloadEntity implements Prisma.BatchPayload {
  count: number;
}
