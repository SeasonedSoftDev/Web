import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'sDc34234.$!$d',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
