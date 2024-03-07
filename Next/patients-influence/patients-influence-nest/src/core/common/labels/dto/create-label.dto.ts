import { AssigneeType } from '../enums/asignee-type.enum';

export class CreateLabelDto {
  name: string;
  assigneeType: AssigneeType;
}
