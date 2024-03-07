import { PartialType } from '@nestjs/swagger';
import { CreateLabelDto } from './create-user-label.dto';

export class UpdateLabelDto extends PartialType(CreateLabelDto) {}
