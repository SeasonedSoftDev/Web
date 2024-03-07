import { ApiProperty } from '@nestjs/swagger';

export class EnumItemResult {
  @ApiProperty({ example: 'status' })
  name: string;

  @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'number' }], example: 0 })
  value: string | number;
}
