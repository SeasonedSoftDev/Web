import { IsEnum, IsOptional } from 'class-validator';
import { Status } from 'src/core/campaign/enums';

export class SMLFilterDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
