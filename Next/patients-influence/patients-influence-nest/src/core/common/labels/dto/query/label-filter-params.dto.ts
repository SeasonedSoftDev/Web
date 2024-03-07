import { IsEnum, IsOptional } from 'class-validator';
import { AssigneeType } from '../../enums/asignee-type.enum';

export class LabelFilterParamsDto {
  @IsEnum(AssigneeType)
  @IsOptional()
  assigneeType?: AssigneeType;
}
