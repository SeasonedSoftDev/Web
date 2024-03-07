import { PartialType } from '@nestjs/swagger';
import { CreateLegalDto } from './create-legal.dto';

export class UpdateLegalDto extends PartialType(CreateLegalDto) {}
