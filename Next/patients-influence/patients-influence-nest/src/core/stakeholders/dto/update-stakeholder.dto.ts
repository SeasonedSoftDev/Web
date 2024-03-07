import { PartialType } from '@nestjs/swagger';
import { CreateStakeholderDto } from './create-stakeholder.dto';

export class UpdateStakeholderDto extends PartialType(CreateStakeholderDto) {}
