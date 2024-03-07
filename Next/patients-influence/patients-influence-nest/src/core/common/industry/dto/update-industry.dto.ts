import { PartialType } from '@nestjs/swagger';
import { CreateIndustryDto } from './create-industry.dto';

export class UpdateIndustryDto extends PartialType(CreateIndustryDto) {}
