import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Status } from 'src/core/campaign/enums/status.enum';

export enum PerformanceType {
  Comments,
  Likes,
  Reach,
  WebsiteClicks,
}

export class ClientCampaignPerformanceFilterParamsDto {
  @IsEnum(Status)
  @IsOptional()
  @ApiPropertyOptional({
    description: `Product status. Note that some products share some or all other of the product's statuses, and others do not.`,
    enum: Status,
  })
  status?: Status;

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.statusAtPointOfTime === 'true' ? true : false))
  @ApiPropertyOptional({
    description: `In each period/interval select a product/s that had status at point of time. If this property is \`false\`, product/s will be selected based on status, but by current status, then will be separated through periods/intervals.`,
    type: Boolean,
    default: false,
  })
  statusAtPointOfTime?: boolean = false;

  @IsEnum(PerformanceType)
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: `Select metric unit like comments, likes etc.`,
    enum: PerformanceType,
  })
  performanceType: PerformanceType;
}
