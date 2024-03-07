import { IsEnum, IsOptional } from 'class-validator';
import { Status } from 'src/core/campaign/enums/status.enum';

export class CampaignFilterParamsDto {
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
