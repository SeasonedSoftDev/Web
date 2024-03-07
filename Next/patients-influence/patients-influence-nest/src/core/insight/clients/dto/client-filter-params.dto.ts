import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserStatus } from 'src/utils';

export class ClientFilterParamsDto {
  @IsEnum(UserStatus)
  @IsOptional()
  @ApiPropertyOptional({
    description: `User status. Note that some users share some or all other of the user's statuses, and others do not.`,
    enum: UserStatus,
  })
  status?: UserStatus;

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.statusAtPointOfTime === 'true' ? true : false))
  @ApiPropertyOptional({
    description: `In each period/interval select a user/s that had status at point of time. If this property is \`false\`, user/s will be selected based on status, but by current status, then will be separated through periods/intervals.`,
    type: Boolean,
    default: false,
  })
  statusAtPointOfTime?: boolean = false;

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.approvedOnly === 'true' ? true : false))
  approvedOnly?: boolean = false;

  @IsNumber()
  @IsOptional()
  industryId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.hasProductOrder === 'true' ? true : false))
  hasProductOrder?: boolean = false;
}
