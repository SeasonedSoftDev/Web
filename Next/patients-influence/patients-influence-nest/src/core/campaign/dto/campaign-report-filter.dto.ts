import { IsEnum, IsOptional } from 'class-validator';
import { ReportType, Status } from '../enums';

export class CampaignReportFilterDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsEnum(ReportType)
  reportType?: ReportType;
}
