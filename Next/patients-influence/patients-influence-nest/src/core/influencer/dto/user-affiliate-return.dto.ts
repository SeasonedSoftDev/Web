import { ApiProperty } from '@nestjs/swagger';

export class UserAffiliateReturnDto {
  id: number;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;
}
