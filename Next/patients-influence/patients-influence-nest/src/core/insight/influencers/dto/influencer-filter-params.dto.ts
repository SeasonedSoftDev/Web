import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { SocialPlatform } from 'src/core/stakeholders/enums/social-platform.enum';
import { UserStatus } from 'src/utils';

export class InfluencerFilterParamsDto {
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

  @IsEnum(SocialPlatform)
  @IsOptional()
  socialPlatform?: SocialPlatform;

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.approvedOnly === 'true' ? true : false))
  approvedOnly?: boolean = false;
}
