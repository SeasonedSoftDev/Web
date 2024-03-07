import { PartialType } from '@nestjs/swagger';
import { CreateSymptomDto } from './create-symptom.dto';

export class UpdateSymptomDto extends PartialType(CreateSymptomDto) {}
