import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserStatus } from 'src/utils';

export class DiscoverClientFilterParamsDto {
  @IsEnum(UserStatus)
  @IsOptional()
  @ApiPropertyOptional({
    description: `User status. Note that some users share some or all other of the user's statuses, and others do not.`,
    enum: UserStatus,
  })
  status?: UserStatus;
}
