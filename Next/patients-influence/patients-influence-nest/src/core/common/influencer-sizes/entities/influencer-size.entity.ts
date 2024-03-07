import { InfluencersSize } from '@prisma/client';

export class InfluencerSizeEntity implements InfluencersSize {
  id: number;
  name: string;
  from: number;
  to: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<InfluencerSizeEntity>) {
    Object.assign(this, data);
  }
}
