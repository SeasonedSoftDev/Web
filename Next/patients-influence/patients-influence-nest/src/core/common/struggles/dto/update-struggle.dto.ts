import { PartialType } from '@nestjs/swagger';
import { CreateStruggleDto } from './create-struggle.dto';

export class UpdateStruggleDto extends PartialType(CreateStruggleDto) {}
