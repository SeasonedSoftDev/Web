import { File } from '@prisma/client';

export class FileEntity implements File {
  id: number;
  url: string;
  key: string;
  filename: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<FileEntity>) {
    Object.assign(this, partial);
  }
}
