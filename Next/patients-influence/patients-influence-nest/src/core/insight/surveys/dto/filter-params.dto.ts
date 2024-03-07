import { IsEnum, IsOptional } from 'class-validator';
import { Status } from 'src/core/campaign/enums/status.enum';

export class SurveyFilterParamsDto {
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
