import { PartialType } from '@nestjs/swagger';
import { CreateEthnicityDto } from './create-ethnicity.dto';

export class UpdateEthnicityDto extends PartialType(CreateEthnicityDto) {}
