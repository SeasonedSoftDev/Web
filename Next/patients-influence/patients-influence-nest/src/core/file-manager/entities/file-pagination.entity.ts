import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { FileEntity } from './file.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FilePaginationEntity extends PaginationResult<FileEntity> {
  @ApiProperty({ type: [FileEntity] })
  result: FileEntity[];
}
