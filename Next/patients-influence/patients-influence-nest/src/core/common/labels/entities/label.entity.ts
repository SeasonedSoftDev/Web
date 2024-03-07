import { ApiHideProperty } from '@nestjs/swagger';
import { Label } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class LabelEntity implements Label {
  id: number;

  name: string;

  assigneeType: number;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<LabelEntity>) {
    Object.assign(this, partial);
  }
}
